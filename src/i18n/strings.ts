// UI Strings Dictionary
// Edit this file to update translations for the interface elements
// Note: Glossary content (definitions, sources, etc.) is auto-translated by Claude

export type Language = 'en' | 'pt';

export interface UIStrings {
  // Header
  appTitle: string;

  // Buttons
  new: string;
  copy: string;
  copied: string;
  mdFile: string;
  docxFile: string;
  generateGlossary: string;

  // Form Labels
  seedWordLabel: string;
  glossaryTitleLabel: string;
  optional: string;

  // Form Placeholders
  seedWordPlaceholder: string;
  titlePlaceholder: string;

  // Form Help Text
  seedWordHelp: string;
  titleHelp: string;

  // Loading
  processing: string;
  generatingGlossary: string;
  loading: string;

  // Intro paragraph (supports HTML - use <br /> for line breaks)
  introParagraph: string;

  // Footer
  createdBy: string;
  lastUpdate: string;

  // File/Document exports
  glossary: string;
  glossaryBuilder: string;

  // Accessibility
  closeReminder: string;
  scrollToTop: string;
}

export const strings: Record<Language, UIStrings> = {
  en: {
    // Header
    appTitle: 'Glossary Builder',

    // Buttons
    new: 'New',
    copy: 'Copy',
    copied: 'Copied!',
    mdFile: 'MD File',
    docxFile: 'DOCX File',
    generateGlossary: 'Generate Glossary',

    // Form Labels
    seedWordLabel: 'Seed Word',
    glossaryTitleLabel: 'Glossary Title',
    optional: '(optional)',

    // Form Placeholders
    seedWordPlaceholder: 'e.g., Neural Network',
    titlePlaceholder: 'e.g., Machine Learning',

    // Form Help Text
    seedWordHelp: 'Enter a term or concept to build your glossary around',
    titleHelp: 'Give your glossary a descriptive title. This helps Claude understand the context of the Seed Word.',

    // Loading
    processing: 'Processing...',
    generatingGlossary: 'Generating glossary with 12 terms...',
    loading: 'Loading...',

    // Intro paragraph
    introParagraph: 'Build glossaries powered by Claude AI.<br />Just enter a single term (Seed Word) and automatically generate 12 related terms with clear definitions. Output is optimized for technical, scientific, and educational contexts in any language.',

    // Footer
    createdBy: 'Created by Lula Rocha + Claude',
    lastUpdate: 'Last update: February 7, 2026',

    // File/Document exports
    glossary: 'Glossary',
    glossaryBuilder: 'GLOSSARY BUILDER',

    // Accessibility
    closeReminder: 'Close reminder',
    scrollToTop: 'Scroll to top',
  },

  pt: {
    // Header
    appTitle: 'Construtor de Glossário',

    // Buttons
    new: 'Novo',
    copy: 'Copiar',
    copied: 'Copiado!',
    mdFile: 'Arquivo MD',
    docxFile: 'Arquivo DOCX',
    generateGlossary: 'Gerar Glossário',

    // Form Labels
    seedWordLabel: 'Palavra Semente',
    glossaryTitleLabel: 'Título do Glossário',
    optional: '(opcional)',

    // Form Placeholders
    seedWordPlaceholder: 'ex., Rede Neural',
    titlePlaceholder: 'ex., Aprendizado de Máquina',

    // Form Help Text
    seedWordHelp: 'Digite um termo ou conceito para construir seu glossário',
    titleHelp: 'Dê um título descritivo ao seu glossário. Isso ajuda o Claude a entender o contexto da Palavra Semente.',

    // Loading
    processing: 'Processando...',
    generatingGlossary: 'Gerando glossário com 12 termos...',
    loading: 'Carregando...',

    // Intro paragraph
    introParagraph: 'Crie glossários com a tecnologia do Claude AI.<br />Basta inserir um único termo (Palavra Semente) e gerar automaticamente 12 termos relacionados com definições claras. A saída é otimizada para contextos técnicos, científicos e educacionais em qualquer idioma.',

    // Footer
    createdBy: 'Criado por Lula Rocha + Claude',
    lastUpdate: 'Última atualização: 7 de fevereiro de 2026',

    // File/Document exports
    glossary: 'Glossário',
    glossaryBuilder: 'CONSTRUTOR DE GLOSSÁRIO',

    // Accessibility
    closeReminder: 'Fechar lembrete',
    scrollToTop: 'Voltar ao topo',
  },
};
