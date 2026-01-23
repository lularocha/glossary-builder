# Glossary Builder

An AI-powered glossary generator that creates comprehensive, organized glossaries from a single seed word. Perfect for students, educators, researchers, technical writers, or anyone building domain-specific glossaries.

## Overview

Glossary Builder uses Claude AI to automatically generate complete glossaries based on your topic. Enter a title and seed word, and the app generates 12 relevant terms with definitions, importance ratings, and related terms. You can expand your glossary, explore terms in depth, and export everything as a formatted text file.

## Features

- **Smart Generation** - AI generates 12 contextually relevant terms from any seed word
- **Quality Rules** - Built-in rules ensure consistent term selection and clear definitions
- **Importance Ratings** - Each term rated 1-10 for relevance and significance
- **Related Terms** - Cross-referenced connections between glossary entries
- **Expandable** - Add more terms to your glossary (10 at a time)
- **Deep Dive** - Click "Learn More" for detailed explanations, examples, and context
- **Export Ready** - Download as formatted .txt file with title, date, and all terms
- **Local Storage** - All glossaries saved locally in your browser using IndexedDB

## How It Works

1. **Input** - Enter a glossary title and seed word (e.g., "Machine Learning" + "neural networks")
2. **Generation** - Claude AI analyzes the seed word and generates 10 related terms with definitions, importance scores, and related terms
3. **Expand** - Add more terms by clicking "Add More Terms" to grow your glossary
4. **Explore** - Click "Learn More" on any term for in-depth explanations
5. **Export** - Download your complete glossary as a formatted text file
6. **Persistence** - All glossaries are automatically saved to your browser's local storage

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Anthropic API key ([get one here](https://console.anthropic.com/))

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
   VITE_ANTHROPIC_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Tech Stack

### Core
- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server

### Styling
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Icon library

### AI & Storage
- **Anthropic SDK** - Claude AI integration
- **Dexie** - IndexedDB wrapper for local storage

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS** - CSS processing

## Project Structure

```
glossary-builder/
├── api/
│   ├── generate.ts            # Vercel serverless function for Claude API
│   └── GLOSSARY_RULES.md      # Documentation of generation quality rules
├── src/
│   ├── components/            # React components
│   │   ├── GlossaryInput.tsx     # Input form
│   │   └── GlossaryDisplay.tsx   # Term display & interaction
│   ├── utils/                 # Utilities
│   │   ├── claudeApi.ts          # Frontend API wrapper
│   │   └── storage.ts            # Local storage persistence
│   ├── types/                 # TypeScript definitions
│   │   └── glossary.ts
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
- **Definition Structure**: Two sentences - WHAT it is, then WHY it matters
- **Importance Calibration**: 10 = seed word, 9 = prerequisites, 8 = core concepts
- **Consistency**: No orphan references in related terms
