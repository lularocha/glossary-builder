# Glossary Builder - Quick Reference Guide

## 1. Running the Development Server

```bash
npm run dev
```

- Opens at http://localhost:5173 (or similar)
- Hot reloads when you save file changes
- Press Ctrl+C to stop the server

## 2. Reconnecting with Claude Code

If you close this terminal window and want to resume:

### Option A: Same directory

```bash
# Just navigate to the project folder
cd /Users/rocha/Documents/ClaudeCode/glossary-builder
# Claude Code is already running if the original window is still open
```

### Option B: Fresh start

```bash
# Open a new terminal
cd /Users/rocha/Documents/ClaudeCode/glossary-builder
# Start Claude Code again (if you installed it globally)
Claude
```

- Your conversation history is preserved
- I'll remember the context of our project

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

- Test the production build locally

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
- `src/utils/claudeApi.ts` - API configuration (model: claude-3-haiku-20240307)

## 5. Troubleshooting

- **Page is blank?** Check browser console for errors
- **API errors?** Verify `.env` file has `VITE_ANTHROPIC_API_KEY=sk-ant-...`
- **CSS not loading?** Restart dev server with Ctrl+C then `npm run dev`
