# Glossary Builder

An AI-powered glossary generator that creates comprehensive, organized glossaries from a single seed word. Perfect for students, educators, researchers, technical writers, or anyone building domain-specific glossaries.

## Overview

Glossary Builder uses Claude AI to automatically generate complete glossaries based on your topic. Enter a seed word (and optional title), and the app generates 12 relevant terms with clear definitions. Smart formatting automatically detects abbreviations and acronyms, displaying their full expansion for clarity. Export as markdown or Word document with professional formatting.

## Features

### Core Generation
- **Smart Generation** - AI generates 12 contextually relevant terms from any seed word
- **Multilingual Support** - Works in any language with automatic language detection
- **Quality Rules** - Built-in rules ensure consistent term selection and clear definitions
- **Abbreviation Formatting** - Automatically detects abbreviations/acronyms, keeps them in uppercase (e.g., "API", "BASH"), and displays their full expansion

### Learn More Feature
- **Expand Terms** - Click "Learn More" on any term to see additional context
- **Rich Content** - Shows 2-3 detailed paragraphs explaining the concept in depth
- **Official Sources** - Cited references from official documentation (MDN, W3C, official docs)
- **Related Terms** - See how terms connect to other entries in your glossary
- **Smart Caching** - Expanded content is cached locally for instant re-opening

### Export Options
- **Copy to Clipboard** - One-click copy of your entire glossary in markdown format
- **Markdown Export (.md)** - Download as formatted markdown file with all terms and expanded content
- **Word Export (.docx)** - Professional Word document with:
  - Custom header with glossary title
  - Page numbers in footer
  - Proper heading styles (H1, H2)
  - Clickable hyperlinks for sources
  - Optimized font sizes and formatting

### User Experience
- **Bilingual UI** - Toggle between English and Portuguese (PT-BR) interface
- **Auto-save** - Glossary automatically saved to browser localStorage
- **Download Reminder** - Helpful banner reminds you to save your work
- **Scroll to Top** - Quick navigation button on long glossaries
- **Responsive Design** - Mobile-optimized layout with hamburger menu
- **Clean Export Filenames** - Files named as `SeedWord.md` or `SeedWord_Title.docx`

## How It Works

Glossary Builder uses a simple workflow: choose your UI language, enter a seed word (with optional title for context), and Claude AI generates 12 related terms with clear definitions. Each term can be expanded for deeper context with sources from official documentation. Export your glossary as markdown or Word document, and everything auto-saves to your browser.

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

## Usage

### Step 1: Choose Your Interface Language
Toggle between English or Portuguese UI using the language switcher in the top right corner. This only affects the interface—glossaries are generated in the language of your seed word.

### Step 2: Generate a Glossary
1. Enter a **seed word** (required) - the core concept for your glossary
   - Example: "API", "Neural Network", "Photosynthesis"
2. Enter an optional **title** to provide context
   - Example: If seed word is "API", title could be "Web Development" or "REST Architecture"
   - Helps Claude understand the specific domain
3. Click **"Generate Glossary"**
   - Claude AI analyzes your input
   - Generates 12 contextually relevant terms
   - Automatically detects language and formats abbreviations
   - Takes ~15-30 seconds

### Step 3: Review Your Glossary
- Browse through your 12 generated terms
- Each term includes a clear, concise definition
- Abbreviations show their full expansion automatically
- Glossary auto-saves to browser localStorage

### Step 4: Expand Terms (Optional)
Click **"Learn More"** on any term to get deeper insights:
- **Additional Context** - 2-3 detailed paragraphs explaining the concept
- **Related Terms** - See connections to other terms in your glossary
- **Official Sources** - Citations from authoritative documentation (MDN, W3C, official docs)
- **Clickable Links** - Sources open in new tabs
- **Smart Caching** - Expanded content saves locally for instant re-opening

Click **"Show Less"** to collapse expanded content.

### Step 5: Export Your Glossary
Choose from three export options (top buttons on desktop, hamburger menu on mobile):

**Copy to Clipboard**
- One-click copy of entire glossary in markdown format
- Visual "Copied!" confirmation
- Ready to paste into any editor

**MD File**
- Download as formatted markdown (.md)
- Clean heading hierarchy
- Includes all terms, definitions, expanded content, and sources
- Filename: `SeedWord.md` or `SeedWord_Title.md`

**DOCX File**
- Download as professional Word document (.docx)
- Custom header: "GLOSSARY BUILDER: SEEDWORD: TITLE"
- Page numbers in footer
- Proper styles: H1 (24pt), H2 (14pt), body (13pt)
- Clickable hyperlinks for sources
- Filename: `SeedWord.docx` or `SeedWord_Title.docx`

All exports include expanded content if you used "Learn More."

### Step 6: Start a New Glossary (Optional)
Click the orange **"New"** button to:
- Clear your current glossary
- Return to the input page
- Start fresh with a new seed word

Your previous glossary is cleared from localStorage, so make sure to export it first!

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Icon library

### AI & Backend
- **Anthropic SDK** - Claude AI integration (Claude Sonnet 4)
- **Vercel Serverless Functions** - API endpoints (`/api/generate`, `/api/expand`)

### Export & Storage
- **docx** - Word document generation
- **file-saver** - Client-side file downloads
- **localStorage** - Browser-based persistence

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS** - CSS processing

## Project Structure

```
glossary-builder/
├── api/
│   ├── generate.ts            # Serverless function for glossary generation
│   ├── expand.ts              # Serverless function for term expansion
│   └── GLOSSARY_RULES.md      # Documentation of generation quality rules
├── src/
│   ├── components/
│   │   ├── GlossaryInput.tsx      # Input form with language-aware UI
│   │   ├── GlossaryDisplay.tsx    # Term display with Learn More expansion
│   │   ├── LanguageToggle.tsx     # EN/PT UI language switcher
│   │   └── ScrollToTopButton.tsx  # Quick scroll navigation
│   ├── i18n/
│   │   ├── LanguageContext.tsx    # Language state management
│   │   └── strings.ts             # UI translations (EN, PT-BR)
│   ├── utils/
│   │   ├── claudeApi.ts           # API wrapper (generateGlossary, expandTerm)
│   │   └── storage.ts             # localStorage persistence
│   ├── types/
│   │   └── glossary.ts            # TypeScript types (Term, Glossary, Source, etc.)
│   ├── App.tsx                    # Main app with export logic
│   └── main.tsx                   # Entry point
├── public/                        # Static assets (favicon, etc.)
├── index.html                     # HTML template
└── package.json                   # Dependencies & scripts
```

## Quality Rules

The glossary generation follows explicit quality rules to ensure consistent, high-quality output. See [`api/GLOSSARY_RULES.md`](api/GLOSSARY_RULES.md) for full documentation.

Key principles:
- **Term Selection**: Seed word first, foundational terms before specialized variants
- **Formatting**: Abbreviations/acronyms always in uppercase (API, BASH, HTML)
- **Definition Structure**:
  - For abbreviations/acronyms: Expansion sentence, line break, then WHAT it is and WHY it matters
  - For regular terms: Two sentences - WHAT it is, then WHY it matters
- **Language Detection**: Automatically detects input language and generates content in the same language
- **Consistency**: No orphan references in related terms

## Multilingual Support

### UI Languages
- English (EN)
- Portuguese (PT-BR)

Toggle the interface language anytime using the language switcher in the top right.

### Generated Content
Claude AI automatically detects the language of your seed word and generates the glossary in that language:
- Enter "API" → English glossary
- Enter "API" with Portuguese context → Portuguese glossary
- Works with any language Claude supports

All UI elements (buttons, labels, instructions) adapt to your selected language.

## Export Features

### Markdown Export (.md)
- Clean markdown formatting
- All terms and definitions
- Expanded content and sources
- Proper heading hierarchy
- Clickable source links

### Word Document Export (.docx)
- Professional formatting with Arial font
- Custom header: "GLOSSARY BUILDER: SEEDWORD" or "GLOSSARY BUILDER: SEEDWORD: TITLE"
- Page numbers in footer
- H1 for main title (24pt, bold, black)
- H2 for terms (14pt, bold, black)
- Body text (13pt)
- Clickable hyperlinks for sources
- Sources disclaimer in smaller font (12pt)
- Optimized for technical and academic use

### Copy to Clipboard
- Instant markdown copy
- Visual "Copied!" confirmation
- Ready to paste into any editor

## Deployment

This project is configured for Vercel:

1. Connect your repository to Vercel
2. Add `ANTHROPIC_API_KEY` to your Vercel project's environment variables
3. Deploy - Vercel automatically detects and deploys the API functions

The `api/` directory contains Vercel Serverless Functions that handle Claude API calls server-side, keeping your API key secure.

## Troubleshooting

### Common Issues

**Page is blank?**
- Check browser console for errors
- Clear browser cache and reload

**API errors (404)?**
- Make sure you're using `vercel dev`, not `npm run dev`
- The Vite dev server (`npm run dev`) doesn't include API functions

**API errors (500)?**
- Verify `.env` file exists with valid `ANTHROPIC_API_KEY`
- Check API key permissions at console.anthropic.com

**CSS not loading?**
- Restart dev server with Ctrl+C then `vercel dev`
- Clear browser cache

**Learn More not loading?**
- Check browser console for API errors
- Verify Anthropic API key is valid
- Check network tab for failed `/api/expand` requests

**Glossary disappeared?**
- Check browser localStorage (dev tools → Application → Local Storage)
- Download your glossary as backup before clearing browser data

**Language toggle not working?**
- Check browser console for errors
- Verify LanguageContext is properly loaded

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Requires modern browser with localStorage support.

## License

MIT

## Credits

Created by Lula Rocha + Claude

Last update: February 10, 2026
