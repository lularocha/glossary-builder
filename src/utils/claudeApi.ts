import Anthropic from '@anthropic-ai/sdk';
import type { Glossary, Term } from '../types/glossary';

// Initialize Anthropic client with API key from environment
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage
});

/**
 * Strips markdown code blocks from API responses before parsing JSON.
 * Claude sometimes wraps JSON responses in ```json...``` blocks.
 */
function cleanJsonResponse(text: string): string {
  // Remove markdown code blocks if present
  const codeBlockPattern = /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/;
  const match = text.trim().match(codeBlockPattern);
  return match ? match[1].trim() : text.trim();
}

/**
 * Generates a new glossary based on a seed word.
 *
 * This function creates an initial glossary with 10 technical terms related to the seed word.
 * The prompt emphasizes:
 * - Technical/development context
 * - Clear, concise definitions
 * - Importance scoring (1-10)
 * - Related terms for each entry
 *
 * @param title - Optional title for the glossary (used for domain context)
 * @param seedWord - The initial term to build the glossary around
 * @returns Promise<Glossary> - A complete glossary object
 */
export async function generateGlossary(
  title: string | undefined,
  seedWord: string
): Promise<Glossary> {
  try {
    // Build the prompt with context about the domain if title is provided
    const domainContext = title
      ? `The glossary is titled "${title}", so focus on terms relevant to this domain.`
      : 'Focus on technical and development-related terms.';

    const prompt = `You are a technical glossary expert. Generate a comprehensive glossary based on the seed word: "${seedWord}".

${domainContext}

Create a glossary with:
1. A brief description (2-3 sentences) explaining what this glossary covers
2. Exactly 10 technical terms related to "${seedWord}"

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

    // Extract the text content from the response
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from Claude API');
    }

    // Clean and parse the JSON response
    const cleanedText = cleanJsonResponse(content.text);
    const parsed = JSON.parse(cleanedText);

    // Construct and return the complete Glossary object
    const glossary: Glossary = {
      id: crypto.randomUUID(),
      title: title,
      description: parsed.description,
      seedWord: seedWord,
      terms: parsed.terms,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return glossary;
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Claude API Error: ${error.message}`);
    }
    if (error instanceof SyntaxError) {
      console.error('JSON Parse Error in generateGlossary. Raw response:', error);
      throw new Error('Failed to parse Claude API response as JSON');
    }
    throw error;
  }
}

/**
 * Expands an existing glossary by adding 10 more related terms.
 *
 * This function:
 * - Sends the existing glossary context to Claude
 * - Requests 10 new terms that complement existing ones
 * - Ensures no duplication of existing terms
 * - Maintains consistency in quality and relevance
 *
 * @param glossary - The existing glossary to expand
 * @returns Promise<Term[]> - Array of 10 new terms
 */
export async function expandTerms(glossary: Glossary): Promise<Term[]> {
  try {
    // Create a list of existing terms to avoid duplication
    const existingTermNames = glossary.terms.map((t) => t.term).join(', ');

    const prompt = `You are a technical glossary expert. I have an existing glossary about "${glossary.seedWord}" with these terms already defined:

${existingTermNames}

Generate 10 MORE technical terms related to this glossary that are NOT in the list above. These should be:
- Complementary to the existing terms
- Relevant to the domain of "${glossary.seedWord}"
- ${glossary.title ? `Aligned with the "${glossary.title}" context` : 'Technical/development focused'}
- Different from all existing terms (no duplicates!)

For each new term, provide:
- term: The technical term or concept name (must be unique!)
- definition: A clear, concise definition (1-2 sentences)
- importance: A score from 1-10 indicating importance/fundamentality
- relatedTerms: An array of 2-4 related terms (can reference existing terms or new terms in this batch)

Return ONLY valid JSON in this exact format:
{
  "terms": [
    {
      "term": "New Term Name",
      "definition": "Clear definition",
      "importance": 7,
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

    // Extract the text content from the response
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from Claude API');
    }

    // Clean and parse the JSON response
    const cleanedText = cleanJsonResponse(content.text);
    const parsed = JSON.parse(cleanedText);

    return parsed.terms;
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Claude API Error: ${error.message}`);
    }
    if (error instanceof SyntaxError) {
      console.error('JSON Parse Error in expandTerms. Raw response:', error);
      throw new Error('Failed to parse Claude API response as JSON');
    }
    throw error;
  }
}

/**
 * Generates detailed content for a specific term.
 *
 * This function:
 * - Takes a term and optional glossary context
 * - Generates comprehensive explanation with examples
 * - Returns detailed content suitable for "Learn More" expansion
 *
 * Note: The current Term interface doesn't have a detailedContent field.
 * Consider adding it if you want to persist this information.
 *
 * @param term - The term to get detailed information about
 * @param glossaryContext - Optional context from the parent glossary
 * @returns Promise<string> - Detailed explanation in markdown format
 */
export async function expandTermDetail(
  term: Term,
  glossaryContext?: { title?: string; seedWord: string }
): Promise<string> {
  try {
    const contextInfo = glossaryContext
      ? `This term is part of a glossary about "${glossaryContext.seedWord}"${
          glossaryContext.title ? ` titled "${glossaryContext.title}"` : ''
        }.`
      : '';

    const prompt = `You are a technical glossary expert. Provide a detailed explanation for the following term:

**Term:** ${term.term}
**Basic Definition:** ${term.definition}
${contextInfo}

Generate a comprehensive, detailed explanation that includes:
1. Expanded explanation (2-3 paragraphs)
2. Real-world use cases or applications
3. Common examples or scenarios
4. Key concepts or considerations
5. Relationship to related terms: ${term.relatedTerms.join(', ')}

Format your response in markdown. Make it educational and practical for developers/technical users.
Do NOT include a heading for the term name (it will be displayed separately).
Start directly with the detailed content.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract the text content from the response
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from Claude API');
    }

    return content.text;
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Claude API Error: ${error.message}`);
    }
    throw error;
  }
}
