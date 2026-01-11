export interface Term {
  term: string;
  definition: string;
  importance: number;
  relatedTerms: string[];
  expanded?: boolean;
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
