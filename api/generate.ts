import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

interface Term {
  term: string;
  definition: string;
  importance: number;
  relatedTerms: string[];
}

interface Translations {
  generatedGlossary: string;
  learnMore: string;
  showLess: string;
  sources: string;
  linksDisclaimer: string;
  relatedTerms: string;
  seedWord: string;
  totalTerms: string;
  downloadReminder: string;
}

const DEFAULT_TRANSLATIONS: Translations = {
  generatedGlossary: 'Generated glossary',
  learnMore: 'Learn more',
  showLess: 'Show less',
  sources: 'Sources',
  linksDisclaimer: 'Links verified at time of generation. External sites may change.',
  relatedTerms: 'Related Terms:',
  seedWord: 'Seed Word:',
  totalTerms: 'Total Terms:',
  downloadReminder: "Don't forget to download your glossary! Your generated glossary will be lost if you hit the \"Start New\" button or exit this page.",
};

interface GenerateRequest {
  title?: string;
  seedWord: string;
}

interface GenerateResponse {
  id: string;
  title?: string;
  description: string;
  seedWord: string;
  detectedLanguage: string;
  translations: Translations;
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
      ? `The glossary is titled "${title}". IMPORTANT: Interpret the seed word "${seedWord}" within this context. Select terms and write definitions that are specific to this domain. If the seed word has multiple meanings, use only the meaning relevant to "${title}".`
      : 'Focus on technical and development-related terms.';

    const prompt = `You are a technical glossary expert. Generate a comprehensive glossary based on the seed word: "${seedWord}".

## Language Detection
Detect the language of the seed word "${seedWord}". Generate ALL content (description and definitions) in this detected language.
Include the detected language name in English (e.g., "Portuguese", "Spanish", "German") in your response.

If the detected language is NOT English, provide translated UI labels in the "translations" object.
If English, use these exact default labels:
- generatedGlossary: "Generated glossary"
- learnMore: "Learn more"
- showLess: "Show less"
- sources: "Sources"
- linksDisclaimer: "Links verified at time of generation. External sites may change."
- relatedTerms: "Related Terms:"
- seedWord: "Seed Word:"
- totalTerms: "Total Terms:"
- downloadReminder: "Don't forget to download your glossary! Your generated glossary will be lost if you hit the \\"Start New\\" button or exit this page."

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

## Formatting Rules
- Abbreviations/acronyms MUST be written in ALL UPPERCASE (e.g., "API", "BASH", "HTML", "REST")
- If the seed word is an abbreviation, keep it in uppercase as the term name
- Regular terms use standard title case

## Definition Rules
- For abbreviations/acronyms:
  * Sentence 1: State what it stands for (e.g., "API stands for Application Programming Interface.")
  * Add a line break after this sentence (use \\n for a single line break)
  * Sentence 2: WHAT it is (category + key characteristic)
  * Sentence 3: WHY it matters or HOW it's used
- For regular terms:
  * Sentence 1: WHAT it is (category + key characteristic)
  * Sentence 2: WHY it matters or HOW it's used
- Never use the term in its own definition
- Be specific - avoid "various", "different", "many"
- Maximum 50 words per definition (expansion sentence for abbreviations not counted)

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

Example of an abbreviation/acronym term:
{
  "term": "API",
  "definition": "API stands for Application Programming Interface.\\nA set of protocols and tools that defines how software components should interact. Essential for creating modular, interoperable systems that can communicate across different platforms.",
  "importance": 8,
  "relatedTerms": ["REST", "HTTP", "SDK"]
}

Return ONLY valid JSON in this exact format:
{
  "detectedLanguage": "English",
  "translations": {
    "generatedGlossary": "Generated glossary",
    "learnMore": "Learn more",
    "showLess": "Show less",
    "sources": "Sources",
    "linksDisclaimer": "Links verified at time of generation. External sites may change.",
    "relatedTerms": "Related Terms:",
    "seedWord": "Seed Word:",
    "totalTerms": "Total Terms:",
    "downloadReminder": "Don't forget to download your glossary! Your generated glossary will be lost if you hit the \\"Start New\\" button or exit this page."
  },
  "description": "Brief description of the glossary IN THE DETECTED LANGUAGE",
  "terms": [
    {
      "term": "Term Name",
      "definition": "Clear definition following the rules above IN THE DETECTED LANGUAGE",
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
      detectedLanguage: parsed.detectedLanguage || 'English',
      translations: parsed.translations || DEFAULT_TRANSLATIONS,
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
