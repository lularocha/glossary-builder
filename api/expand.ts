import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

interface Source {
  name: string;
  url?: string;
  description?: string;
}

interface ExpandRequest {
  term: string;
  definition: string;
  glossaryTitle?: string;
  seedWord: string;
  detectedLanguage?: string;
}

interface ExpandResponse {
  paragraphs: string[];
  sources: Source[];
  generatedAt: string;
}

/**
 * Strips markdown code blocks and other formatting from API responses before parsing JSON.
 */
function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();

  // Remove markdown code blocks with optional language identifier
  const codeBlockPattern = /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/;
  const match = cleaned.match(codeBlockPattern);
  if (match) {
    cleaned = match[1].trim();
  }

  // Remove any leading/trailing text that's not part of the JSON object
  const jsonPattern = /(\{[\s\S]*\})/;
  const jsonMatch = cleaned.match(jsonPattern);
  if (jsonMatch) {
    cleaned = jsonMatch[1];
  }

  return cleaned;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { term, definition, glossaryTitle, seedWord, detectedLanguage } = request.body as ExpandRequest;

  if (!term || typeof term !== 'string') {
    return response.status(400).json({ error: 'term is required' });
  }

  if (!definition || typeof definition !== 'string') {
    return response.status(400).json({ error: 'definition is required' });
  }

  if (!seedWord || typeof seedWord !== 'string') {
    return response.status(400).json({ error: 'seedWord is required' });
  }

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const domainContext = glossaryTitle
      ? `This term is part of a "${glossaryTitle}" glossary about "${seedWord}".`
      : `This term is part of a technical glossary about "${seedWord}".`;

    const languageInstruction = detectedLanguage && detectedLanguage !== 'English'
      ? `\n## Language Requirement\nGenerate all paragraphs and source descriptions in ${detectedLanguage}. Source names (like "Python Documentation") may remain in their original language if they are proper nouns.\n`
      : '';

    const prompt = `You are a technical documentation expert. Provide expanded information for the following term.
${languageInstruction}
TERM: "${term}"
CURRENT DEFINITION: "${definition}"
DOMAIN CONTEXT: ${domainContext}

## Your Task
Generate additional context and cite reliable sources for this term.${detectedLanguage && detectedLanguage !== 'English' ? ` Write all content in ${detectedLanguage}.` : ''}

## Content Requirements
1. Write 1-3 paragraphs (each 40-80 words) that:
   - Expand on practical applications or use cases
   - Explain common patterns or best practices
   - Clarify nuances or edge cases
   - Do NOT repeat the definition

2. Cite 1-3 reliable sources from these categories ONLY:
   - Official documentation (language/framework docs)
   - MDN Web Docs (for web technologies)
   - W3C specifications
   - RFCs and official standards
   - Reputable publisher documentation (e.g., Oracle, Microsoft, Google)

## CRITICAL URL Rules
- NEVER include Wikipedia links
- Only include a URL if you are HIGHLY confident it exists and is stable
- If unsure about a URL, provide ONLY the source name without a URL
- Prefer documentation paths that are unlikely to change (e.g., "/docs/concepts/" over dated blog posts)
- When citing official docs, use the most stable/canonical URL format

## Response Format
Return ONLY valid JSON:
{
  "paragraphs": [
    "First paragraph of expanded context...",
    "Second paragraph with practical details..."
  ],
  "sources": [
    {
      "name": "Python Official Documentation - Functions",
      "url": "https://docs.python.org/3/tutorial/controlflow.html#defining-functions",
      "description": "Official tutorial on defining and using functions"
    },
    {
      "name": "Real Python Advanced Guide",
      "description": "Covers advanced function patterns and decorators"
    }
  ]
}

Note: The second source example shows a citation WITHOUT a URL - use this format when you cannot guarantee URL validity.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      return response.status(500).json({ error: 'Unexpected response format from Claude API' });
    }

    const cleanedText = cleanJsonResponse(content.text);

    let parsed;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw response:', content.text.substring(0, 500));
      console.error('Cleaned text:', cleanedText.substring(0, 500));
      throw new SyntaxError('Failed to parse Claude API response as JSON');
    }

    // Validate the parsed response has the expected structure
    if (!Array.isArray(parsed.paragraphs) || !Array.isArray(parsed.sources)) {
      console.error('Invalid response structure:', parsed);
      return response.status(500).json({ error: 'Invalid response structure from Claude API' });
    }

    const expandResponse: ExpandResponse = {
      paragraphs: parsed.paragraphs,
      sources: parsed.sources,
      generatedAt: new Date().toISOString(),
    };

    return response.status(200).json(expandResponse);
  } catch (error) {
    console.error('Error expanding term:', error);

    if (error instanceof Anthropic.APIError) {
      return response.status(500).json({ error: `Claude API Error: ${error.message}` });
    }
    if (error instanceof SyntaxError) {
      return response.status(500).json({ error: 'Failed to parse Claude API response as JSON' });
    }

    return response.status(500).json({ error: 'Internal server error' });
  }
}
