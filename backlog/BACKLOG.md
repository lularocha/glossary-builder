# Glossary Builder - Feature Backlog

## Implemented Features

### Learn More - Term Expansion (Implemented January 2026)

**Description:**
Allows users to expand any term with additional context paragraphs and source citations from official documentation.

**Implementation:**
- "Learn More" button on each term in the glossary display
- Clicking expands the term to show 1-3 additional paragraphs
- Shows source citations with optional links to official documentation
- Sources prioritized: Official docs, MDN, W3C, RFCs (no Wikipedia)
- Links open in new tabs with disclaimer about external sites
- Expanded content is cached and persists to localStorage

**Files:**
- `api/expand.ts` - New serverless endpoint
- `src/types/glossary.ts` - Added Source, ExpandedContent interfaces
- `src/utils/claudeApi.ts` - Added expandTerm() function
- `src/components/GlossaryDisplay.tsx` - Added expand UI
- `src/App.tsx` - Added expansion state management

---

## Future Features

### Add More Terms

**Description:**
Allow users to add additional terms to an existing glossary.

**Use Case:**
- User generates initial glossary (e.g., seed word: "Bash", title: "Terminal")
- User wants to extend it with a prompt like "add basic commands"
- System generates additional terms and appends them to current glossary

**Possible Implementation Approaches:**

1. **Add to Existing Glossary**
   - Input field appears after glossary is generated
   - User provides extension prompt (e.g., "add 5 more terms about commands")
   - System generates additional terms and appends them to current glossary
   - Maintains context of existing terms to avoid duplicates

2. **Generate Related Glossary**
   - Creates a new separate glossary based on the extension prompt
   - Links to original glossary for reference

**Implementation Considerations:**
- Need to pass existing glossary context to the API
- Deduplication logic to prevent duplicate terms
- UI/UX for the extension input field
- Context window management for large existing glossaries

**API Changes Needed:**
- Extend `/api/generate` to accept optional existing glossary data
- Add parameter for "mode": "new" | "extend"
