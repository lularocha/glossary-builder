# Glossary Builder - Feature Backlog

## Next Feature

### Info/Help Page

**Description:**
Add an in-app Info/Help page where users can see how the Glossary Builder works in detail. Content and formatting should match the "Usage" section from README.md.

**Use Case:**
- New users want to understand how to use the tool
- Users need guidance on specific features (Learn More, Export options)
- Users want quick reference without leaving the app or visiting GitHub

**Possible Implementation Approaches:**

1. **Modal Overlay**
   - Add "Help" or "?" icon button in header (next to language toggle)
   - Clicking opens a modal overlay with help content
   - Uses same styling as existing UI (max-w-[760px], Tailwind classes)
   - Easy to dismiss (X button, click outside, ESC key)
   - **Pros:** Simple, non-intrusive, works on any page
   - **Cons:** Limited screen space on mobile, content might be truncated

2. **Dedicated Route (/help)**
   - Add React Router for client-side routing
   - New route: `/help` displays full help page
   - Link in footer or header ("Help" button)
   - Full-page layout with scroll
   - **Pros:** More space for content, shareable URL, better for long content
   - **Cons:** Requires router setup, adds complexity, navigation overhead

3. **Collapsible Section on Input Page**
   - Add expandable "How to Use" section below the intro paragraphs
   - Collapsed by default, click to expand
   - Shows full usage guide inline
   - **Pros:** Contextual (visible when most needed), no routing needed
   - **Cons:** Makes input page longer, less discoverable after generation

4. **Hybrid: Info Icon with Slide-out Panel**
   - Add "Info" icon in header
   - Slides in from right (similar to mobile menu pattern)
   - Uses same slide-out mechanism as mobile hamburger menu
   - **Pros:** Reuses existing slide-out pattern, feels native, good mobile UX
   - **Cons:** Requires new component, slightly more complex

**Content Strategy:**

1. **Static Copy-Paste**
   - Copy README Usage section content into React component as JSX
   - Manually keep in sync when README changes
   - **Pros:** Simple, full control over formatting
   - **Cons:** Content duplication, manual sync required

2. **Markdown Import**
   - Extract Usage section from README.md into separate `USAGE.md` file
   - Import and render with markdown-to-JSX library
   - Single source of truth
   - **Pros:** No duplication, easier to maintain
   - **Cons:** Requires markdown parser dependency, formatting differences

3. **Shared TypeScript Constant**
   - Move help content to `src/constants/helpContent.ts`
   - Use in both app and README generation script
   - **Pros:** Single source, type-safe
   - **Cons:** README is no longer standard markdown, complex setup

**Recommended Approach:**
**Modal Overlay (#1) + Static Copy-Paste (#1)** for MVP because:
- Simplest to implement (single component, no routing)
- Works everywhere (input page and glossary page)
- Mobile-friendly with proper responsive design
- No new dependencies
- Can iterate to markdown import later if maintenance becomes an issue

**Implementation Steps:**
1. Create `src/components/HelpModal.tsx` component
2. Copy Usage section content from README.md and convert to JSX
3. Add state management for modal open/close
4. Add "Help" button (? icon) to header next to LanguageToggle
5. Style with Tailwind (modal backdrop, max-w-[760px] content, scroll)
6. Add close handlers (X button, ESC key, click outside)
7. Make bilingual (EN/PT) using existing i18n system

**Files to Create/Modify:**
- `src/components/HelpModal.tsx` (new)
- `src/i18n/strings.ts` (add help content translations)
- `src/App.tsx` (add Help button and modal state)

**Estimated Effort:** 2-3 hours

## Other Possible Features (under review)

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
