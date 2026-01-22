import type { Glossary, Term } from '../types/glossary';

// Storage keys with namespace to avoid conflicts
const STORAGE_KEYS = {
  glossary: 'glossary-builder:glossary',
  termDetails: 'glossary-builder:termDetails',
} as const;

// Serialized version of Glossary with Date objects as ISO strings
interface SerializedGlossary {
  id: string;
  title?: string;
  description: string;
  seedWord: string;
  terms: Term[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Save glossary to localStorage
 * Handles null glossary by clearing the storage
 */
export function saveGlossary(glossary: Glossary | null): void {
  try {
    if (glossary === null) {
      localStorage.removeItem(STORAGE_KEYS.glossary);
      return;
    }

    const serialized: SerializedGlossary = {
      ...glossary,
      createdAt: glossary.createdAt.toISOString(),
      updatedAt: glossary.updatedAt.toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.glossary, JSON.stringify(serialized));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('[Storage] localStorage quota exceeded. Unable to save glossary.');
    } else {
      console.warn('[Storage] Error saving glossary:', error);
    }
  }
}

/**
 * Load glossary from localStorage
 * Returns null if no glossary is saved or if there's an error
 */
export function loadGlossary(): Glossary | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.glossary);
    if (!data) {
      return null;
    }

    const parsed = JSON.parse(data) as SerializedGlossary;

    // Validate the structure
    if (!parsed.id || !parsed.description || !parsed.seedWord || !Array.isArray(parsed.terms)) {
      console.warn('[Storage] Invalid glossary structure, clearing storage');
      localStorage.removeItem(STORAGE_KEYS.glossary);
      return null;
    }

    // Deserialize: convert ISO strings back to Date objects
    const glossary: Glossary = {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt),
    };

    return glossary;
  } catch (error) {
    console.warn('[Storage] Error loading glossary:', error);
    // Clear corrupted data
    localStorage.removeItem(STORAGE_KEYS.glossary);
    return null;
  }
}

/**
 * Save term details map to localStorage
 * Converts Map to array for JSON serialization
 */
export function saveTermDetails(termDetails: Map<string, string>): void {
  try {
    const arrayData = Array.from(termDetails.entries());
    localStorage.setItem(STORAGE_KEYS.termDetails, JSON.stringify(arrayData));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('[Storage] localStorage quota exceeded. Unable to save term details.');
    } else {
      console.warn('[Storage] Error saving term details:', error);
    }
  }
}

/**
 * Load term details from localStorage
 * Returns empty Map if no data is saved or if there's an error
 */
export function loadTermDetails(): Map<string, string> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.termDetails);
    if (!data) {
      return new Map();
    }

    const parsed = JSON.parse(data);

    // Validate it's an array
    if (!Array.isArray(parsed)) {
      console.warn('[Storage] Invalid term details structure, clearing storage');
      localStorage.removeItem(STORAGE_KEYS.termDetails);
      return new Map();
    }

    return new Map(parsed);
  } catch (error) {
    console.warn('[Storage] Error loading term details:', error);
    // Clear corrupted data
    localStorage.removeItem(STORAGE_KEYS.termDetails);
    return new Map();
  }
}

/**
 * Clear all saved data from localStorage
 */
export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.glossary);
    localStorage.removeItem(STORAGE_KEYS.termDetails);
  } catch (error) {
    console.warn('[Storage] Error clearing storage:', error);
  }
}
