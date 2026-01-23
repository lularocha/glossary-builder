import type { Glossary } from '../types/glossary';

/**
 * Generates a new glossary based on a seed word.
 * Calls the serverless function at /api/generate.
 *
 * @param title - Optional title for the glossary (used for domain context)
 * @param seedWord - The initial term to build the glossary around
 * @returns Promise<Glossary> - A complete glossary object with 12 terms
 */
export async function generateGlossary(
  title: string | undefined,
  seedWord: string
): Promise<Glossary> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, seedWord }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  const data = await response.json();

  // Convert ISO date strings back to Date objects
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
}
