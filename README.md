# Glossary Builder

An AI-powered glossary generator that helps you create comprehensive, organized glossaries from a single seed word. Perfect for students, educators, researchers, technical writers, or anyone who needs to build domain-specific glossaries quickly.

## What It Does

**Glossary Builder** uses Claude AI to automatically generate complete glossaries based on your topic. Simply provide a title and a seed word, and the app will:

- Generate 10 relevant terms with clear definitions
- Rate each term's importance (1-10 scale)
- Identify related terms for cross-referencing
- Allow you to expand your glossary with additional terms
- Provide detailed explanations when you want to learn more about specific terms
- Export your complete glossary as a markdown file

## Features

- **Smart Generation**: Start with any seed word and get a curated list of related terms
- **Expandable**: Add more terms to your glossary as needed (10 at a time)
- **Deep Dive**: Click "Learn More" on any term for detailed explanations, examples, and context
- **Export Ready**: Download your glossary as a formatted markdown file
- **Clean Interface**: Simple, intuitive design that keeps you focused on learning

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Anthropic API key:
   ```
   VITE_ANTHROPIC_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

Built with React, TypeScript, and Vite for a fast, modern development experience. Powered by Claude AI via the Anthropic API for intelligent content generation.
