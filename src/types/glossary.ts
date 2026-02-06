export interface Source {
  name: string;
  url?: string;
  description?: string;
}

export interface Translations {
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

export const DEFAULT_TRANSLATIONS: Translations = {
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

export interface ExpandedContent {
  paragraphs: string[];
  sources: Source[];
  loadedAt: Date;
}

export interface Term {
  term: string;
  definition: string;
  importance: number;
  relatedTerms: string[];
  expanded?: boolean;
  expandedContent?: ExpandedContent;
}

export interface Glossary {
  id: string;
  title?: string;
  description: string;
  seedWord: string;
  detectedLanguage?: string;
  translations?: Translations;
  terms: Term[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GlossaryInput {
  title?: string;
  seedWord: string;
}
