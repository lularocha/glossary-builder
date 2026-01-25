# Glossary Builder

An AI-powered glossary generator that creates comprehensive, organized glossaries from a single seed word. Perfect for students, educators, researchers, technical writers, or anyone building domain-specific glossaries.

## Overview

Glossary Builder uses Claude AI to automatically generate complete glossaries based on your topic. Enter a title and seed word, and the app generates 12 relevant terms with clear definitions, importance ratings, and related terms. Smart formatting automatically detects abbreviations and acronyms, displaying their full expansion for clarity. Copy to clipboard or download as a formatted markdown file.

## Features

- **Smart Generation** - AI generates 12 contextually relevant terms from any seed word
- **Learn More** - Expand any term to see additional context paragraphs and cited sources from official documentation (MDN, W3C, official docs)
- **Abbreviation Formatting** - Automatically detects abbreviations/acronyms, keeps them in uppercase (e.g., "API", "BASH"), and displays their full expansion
- **Quality Rules** - Built-in rules ensure consistent term selection and clear definitions
- **Importance Ratings** - Each term rated 1-10 for relevance and significance
- **Related Terms** - Cross-referenced connections between glossary entries
- **Copy to Clipboard** - One-click copy of your glossary in markdown format
- **Export Ready** - Download as formatted markdown file (.md) with all terms and expanded content
- **Local Storage** - Glossary automatically saved in your browser's localStorage

## How It Works

1. **Input** - Enter a glossary title (optional) and seed word (e.g., "Working with APIs" + "API")
2. **Generation** - Claude AI analyzes the seed word and generates 12 related terms with clear definitions, importance scores, and related terms
3. **Smart Formatting** - Abbreviations and acronyms automatically show their full expansion on the first line
4. **Review** - Browse through your generated glossary with clean, readable formatting
5. **Learn More** - Click "Learn More" on any term to expand it with additional context and source citations from official documentation
6. **Copy or Download** - Copy your glossary to clipboard or download as a markdown file (.md) - includes expanded content and sources
7. **Persistence** - Your glossary is automatically saved to your browser's localStorage

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Anthropic API key ([get one here](https://console.anthropic.com/))
- Vercel CLI (install globally: `npm install -g vercel`)

### Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd glossary-builder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   ANTHROPIC_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   vercel dev
   ```

   **Important**: Use `vercel dev` (not `npm run dev`) to run both the frontend and API functions locally.

5. Open your browser to `http://localhost:3000`

### Building for Production

This project is designed for Vercel deployment:

```bash
# Build locally
npm run build

# Preview production build locally (frontend only)
npm run preview

# Deploy to Vercel
vercel --prod
```

The API functions in `api/` are deployed as Vercel Serverless Functions.

## Tech Stack

### Core
- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server

### Styling
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Icon library

### AI & Storage
- **Anthropic SDK** - Claude AI integration (Claude Sonnet 4)
- **localStorage** - Browser-based persistence (Dexie installed for future IndexedDB migration)

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS** - CSS processing

## Project Structure

```
glossary-builder/
├── api/
│   ├── generate.ts            # Vercel serverless function for glossary generation (/api/generate)
│   ├── expand.ts              # Vercel serverless function for term expansion (/api/expand)
│   └── GLOSSARY_RULES.md      # Documentation of generation quality rules
├── src/
│   ├── components/            # React components
│   │   ├── GlossaryInput.tsx     # Input form
│   │   └── GlossaryDisplay.tsx   # Term display & Learn More expansion
│   ├── utils/                 # Utilities
│   │   ├── claudeApi.ts          # Frontend API wrapper (generateGlossary, expandTerm)
│   │   └── storage.ts            # Local storage persistence
│   ├── types/                 # TypeScript definitions
│   │   └── glossary.ts           # Term, Glossary, Source, ExpandedContent types
│   ├── App.tsx                # Main app component
│   └── main.tsx               # Entry point
├── public/                    # Static assets
├── index.html                 # HTML template
└── package.json               # Dependencies & scripts
```

## Quality Rules

The glossary generation follows explicit quality rules to ensure consistent, high-quality output. See [`api/GLOSSARY_RULES.md`](api/GLOSSARY_RULES.md) for full documentation.

Key principles:
- **Term Selection**: Seed word first, foundational terms before specialized variants
- **Formatting**: Abbreviations/acronyms always in uppercase (API, BASH, HTML)
- **Definition Structure**:
  - For abbreviations/acronyms: Expansion sentence, line break, then WHAT it is and WHY it matters
  - For regular terms: Two sentences - WHAT it is, then WHY it matters
- **Importance Calibration**: 10 = seed word, 9 = prerequisites, 8 = core concepts
- **Consistency**: No orphan references in related terms

## Deployment

This project is configured for Vercel:

1. Connect your repository to Vercel
2. Add `ANTHROPIC_API_KEY` to your Vercel project's environment variables
3. Deploy - Vercel automatically detects and deploys the API functions

The `api/` directory contains Vercel Serverless Functions that handle Claude API calls server-side, keeping your API key secure.
