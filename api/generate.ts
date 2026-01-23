import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

interface Term {
  term: string;
  definition: string;
  importance: number;
  relatedTerms: string[];
}

interface GenerateRequest {
  title?: string;
  seedWord: string;
}

interface GenerateResponse {
  id: string;
  title?: string;
  description: string;
  seedWord: string;
  terms: Term[];
  createdAt: string;
  updatedAt: string;
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

  const { title, seedWord } = request.body as GenerateRequest;

  if (!seedWord || typeof seedWord !== 'string') {
    return response.status(400).json({ error: 'seedWord is required' });
  }

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const domainContext = title
      ? `The glossary is titled "${title}", so focus on terms relevant to this domain.`
      : 'Focus on technical and development-related terms.';

    const prompt = `You are a technical glossary expert. Generate a comprehensive glossary based on the seed word: "${seedWord}".

${domainContext}

Create a glossary with:
1. A brief description (2-3 sentences) explaining what this glossary covers
2. Exactly 12 technical terms related to "${seedWord}"

For each term, provide:
- term: The technical term or concept name
- definition: A clear, concise definition (1-2 sentences)
- importance: A score from 1-10 indicating how important/fundamental this term is (10 being most important)
- relatedTerms: An array of 2-4 related term names from the glossary

Make sure terms are interconnected through the relatedTerms field. Prioritize terms that are most relevant in software development, computer science, or the specific domain indicated by the title.

Return ONLY valid JSON in this exact format:
{
  "description": "Brief description of the glossary",
  "terms": [
    {
      "term": "Term Name",
      "definition": "Clear definition",
      "importance": 8,
      "relatedTerms": ["Related Term 1", "Related Term 2"]
    }
  ]
}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
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
    if (!parsed.description || !Array.isArray(parsed.terms)) {
      console.error('Invalid response structure:', parsed);
      return response.status(500).json({ error: 'Invalid response structure from Claude API' });
    }

    const glossary: GenerateResponse = {
      id: crypto.randomUUID(),
      title: title,
      description: parsed.description,
      seedWord: seedWord,
      terms: parsed.terms,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return response.status(200).json(glossary);
  } catch (error) {
    console.error('Error generating glossary:', error);

    if (error instanceof Anthropic.APIError) {
      return response.status(500).json({ error: `Claude API Error: ${error.message}` });
    }
    if (error instanceof SyntaxError) {
      return response.status(500).json({ error: 'Failed to parse Claude API response as JSON' });
    }

    return response.status(500).json({ error: 'Internal server error' });
  }
}
