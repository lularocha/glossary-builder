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

## Term Selection Rules
- The seed word MUST be the first term with importance 10
- Include foundational "atoms" (smallest building blocks of the concept)
- Before including a specialized variant, ensure its parent category exists
- Prefer canonical/historical terms over informal names
- Balance: 3-4 foundational (9-10), 4-5 core (7-8), 3-4 applied (5-7)

## Definition Rules
- Sentence 1: WHAT it is (category + key characteristic)
- Sentence 2: WHY it matters or HOW it's used
- Never use the term in its own definition
- Be specific - avoid "various", "different", "many"
- Maximum 50 words per definition

## Importance Calibration
- 10: The seed word itself
- 9: Absolute prerequisites (cannot understand topic without)
- 8: Core domain concepts
- 7: Important supporting concepts
- 6-5: Specialized/advanced topics

## Consistency Rules
- All relatedTerms MUST reference terms that exist in this glossary
- Relationships should be bidirectional where logical

Example of a well-structured term:
{
  "term": "Gradient Descent",
  "definition": "An optimization algorithm that iteratively adjusts parameters by moving in the direction of steepest decrease of a loss function. It forms the foundation of how neural networks learn from training data.",
  "importance": 8,
  "relatedTerms": ["Loss Function", "Backpropagation", "Learning Rate"]
}

Return ONLY valid JSON in this exact format:
{
  "description": "Brief description of the glossary",
  "terms": [
    {
      "term": "Term Name",
      "definition": "Clear definition following the rules above",
      "importance": 8,
      "relatedTerms": ["Related Term 1", "Related Term 2"]
    }
  ]
}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
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
