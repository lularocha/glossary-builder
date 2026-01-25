# Glossary Builder - Quick Reference Guide

## 1. Running the Development Server

```bash
vercel dev
```

- Opens at http://localhost:3000
- Hot reloads when you save file changes
- Press Ctrl+C to stop the server
- **Important**: Use `vercel dev` (not `npm run dev`) to run both frontend and API functions

## 2. Using the App

### Generate a Glossary
1. Enter an optional title (e.g., "Working with APIs")
2. Enter a seed word (e.g., "API")
3. Click Generate - creates 12 terms with definitions

### Learn More
- Click "Learn More" on any term to expand it
- Shows additional context paragraphs
- Displays source citations from official documentation (MDN, W3C, official docs)
- Links open in new tabs
- Click "Show Less" to collapse

### Export
- Click "Download" to save as a text file
- Includes all terms, definitions, and importance ratings

## 3. Other Useful Commands

### Build for production

```bash
npm run build
```

- Creates optimized files in `/dist` folder
- Run this before deploying

### Preview production build

```bash
npm run preview
```

- Test the production build locally (frontend only)

### Run linting

```bash
npm run lint
```

- Checks code quality and style

### TypeScript check

```bash
npx tsc --noEmit
```

- Checks for TypeScript errors without building

## 4. Important Files

- `.env` - Your API key (never commit this!)
- `package.json` - Dependencies and scripts
- `api/generate.ts` - Glossary generation endpoint
- `api/expand.ts` - Term expansion endpoint (Learn More)
- `src/utils/claudeApi.ts` - Frontend API wrapper

## 5. Environment Variables

Create a `.env` file with:
```
ANTHROPIC_API_KEY=your_api_key_here
```

Note: Use `ANTHROPIC_API_KEY` (not `VITE_ANTHROPIC_API_KEY`) for Vercel serverless functions.

## 6. Troubleshooting

- **Page is blank?** Check browser console for errors
- **API errors (404)?** Make sure you're using `vercel dev`, not `npm run dev`
- **API errors (500)?** Verify `.env` file has valid `ANTHROPIC_API_KEY`
- **CSS not loading?** Restart dev server with Ctrl+C then `vercel dev`
- **Learn More not loading?** Check browser console for API errors
