# Claude Code Instructions

## Local Development Server

**IMPORTANT**: This project uses Vercel serverless functions in the `api/` directory.

### Running Locally

Always use the Vercel CLI for local development:

```bash
vercel dev
```

**DO NOT** use `npm run dev` - this only starts Vite which doesn't include the API endpoints, resulting in 404 errors when trying to generate glossaries.

### Why Vercel Dev?

- The app requires `/api/generate` endpoint which is a Vercel serverless function
- `vercel dev` runs both the frontend AND the API functions
- Default port: `http://localhost:3000`
- The Vite dev server (`npm run dev`) only serves the frontend on port 5173 without API support

### Environment Variables

Ensure you have a `.env` file with:
```
ANTHROPIC_API_KEY=your_api_key_here
```

Note: Use `ANTHROPIC_API_KEY` (not `VITE_ANTHROPIC_API_KEY`) for the Vercel serverless function.
