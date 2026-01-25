export interface Source {
  name: string;
  url?: string;
  description?: string;
}

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
  terms: Term[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GlossaryInput {
  title?: string;
  seedWord: string;
}
