# Glossary Builder - Feature Backlog

## Future Features

### Iterative Glossary Building

**Description:**
Allow users to expand or build upon existing glossaries by providing additional context or requests.

**Use Case:**
- User generates initial glossary (e.g., seed word: "Bash", title: "Terminal")
- User wants to extend it with a prompt like "add basic commands" or "what are other basic shell commands"

**Possible Implementation Approaches:**

1. **Add to Existing Glossary**
   - Input field appears after glossary is generated
   - User provides extension prompt (e.g., "add basic commands")
   - System generates additional terms and appends them to current glossary
   - Maintains context of existing terms to avoid duplicates
   - Updates the glossary in place with new terms

2. **Generate Related Glossary**
   - Same input mechanism
   - Creates a new separate glossary based on the extension prompt
   - Could generate 10-15 new related terms
   - Links to original glossary for reference

**Implementation Considerations:**
- Need to pass existing glossary context to the API
- Deduplication logic to prevent duplicate terms
- UI/UX for the extension input field
- Decision: Single glossary expansion vs. new related glossary (or offer both options)
- Potential to chain multiple iterations
- Consider adding a "version history" or "iterations" tracking

**API Changes Needed:**
- Extend `/api/generate` to accept optional existing glossary data
- Add parameter for "mode": "new" | "extend" | "related"
- Context window management for large existing glossaries

**UI Components:**
- Extension input field component
- Toggle/option to choose between extending or creating new
- Visual indication of newly added terms vs. original terms
