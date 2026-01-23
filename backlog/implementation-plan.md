# Backlog: Future Features & Improvements

This document tracks future enhancements and features under review for the Glossary Builder.

**Last Updated:** January 23, 2026

## Recent Updates (January 23, 2026)

The project received significant UI/UX polish today:
- Fixed content centering at all viewport sizes
- Enhanced input page styling and layout
- Refined UI layout with clear separation of input/display views
- Added responsive hamburger menu for mobile
- Improved button positioning and mobile responsiveness

The app is now in a polished state with a clean, professional UI. The next major feature would be **Multiple Glossaries with History** (see below).

---

## Current State of the Project

### ✅ Completed Features (as of Jan 23, 2026)
- **Core Functionality:**
  - AI-powered glossary generation (12 terms per seed word)
  - Single glossary persistence via localStorage
  - Clean, minimal UI with excellent typography
  - Markdown export functionality

- **UI/UX Improvements (Jan 23, 2026):**
  - Responsive design with mobile-first approach
  - Centered content layout at all viewport sizes (fixed in latest commits)
  - Enhanced input page styling with clear form hierarchy
  - Separate input and display views with clean transitions
  - Header-based action buttons (Start New, Download)
  - Responsive hamburger menu for mobile devices with slide-out panel
  - Creator attribution footer ("Created by Lula Rocha + Claude")
  - Loading states with visual indicators and messages
  - Error handling with user-friendly messages
  - Clean monochromatic design with selective color accents
  - Excellent typography hierarchy
  - Smooth hover/active states on interactive elements

- **Technical Foundation:**
  - TypeScript for type safety
  - Robust localStorage with error handling (`src/utils/storage.ts`)
  - Serialization/deserialization of Date objects
  - Data validation on load
  - Quota exceeded error handling
  - Clean separation of concerns (API, storage, components)

**Current File Structure:**
```
src/
├── components/
│   ├── GlossaryInput.tsx      # Input form component
│   └── GlossaryDisplay.tsx    # Display component for generated glossary
├── types/
│   └── glossary.ts            # TypeScript interfaces
├── utils/
│   ├── storage.ts             # localStorage persistence
│   └── claudeApi.ts           # Frontend API wrapper
└── App.tsx                    # Main app with routing logic

api/
└── generate.ts                # Vercel serverless function (Claude integration)
```

### 🚧 Known Limitations
- Can only save ONE glossary at a time (new glossary overwrites previous)
- No glossary history or browsing interface
- Related terms are generated but hidden in UI (CSS `hidden` class)
- Importance scores generated but not displayed to users
- No ability to add more terms incrementally to existing glossary

---

## 1. Review: Importance Scale UI/UX

### Current State
- ✅ API generates importance score (1-10) for each term
- ✅ Data model includes `importance` field in `Term` interface
- ✅ Export includes importance scores in markdown
- ❌ UI display hidden (not shown to users in display view)

### Issues to Address
The importance scale display was hidden due to UX concerns:
- **Visual clutter**: Dots + numeric rating felt redundant
- **Unclear value**: Users may not understand what "importance" means in context
- **Inconsistent usage**: How should users act on this information?

### Questions for Review
1. **Should we show importance at all?**
   - Is it valuable to users or just noise?
   - Does it help prioritize which terms to learn first?

2. **If yes, how should we display it?**
   - Options:
     - A. Simple numeric score (e.g., "8/10")
     - B. Star rating (★★★★☆)
     - C. Badge/label (e.g., "Core Concept", "Advanced", "Foundational")
     - D. Sort order only (don't show, just use for ranking)
     - E. Color coding (highlight important terms differently)

3. **What does "importance" actually mean?**
   - Should we rename it? (e.g., "Priority", "Relevance", "Fundamentality")
   - Should we add a tooltip explaining the score?

### Proposed Approaches

#### Option A: Remove Entirely (Simplest)
- Stop generating importance scores from API
- Remove field from data model
- Focus on alphabetical or creation-order display

#### Option B: Use for Sorting Only (Hidden Intelligence)
- Keep generating scores
- Sort terms by importance by default
- Don't display the score to users
- Add toggle: "Sort by: Importance | Alphabetical"

#### Option C: Redesign Display (Better UX)
- Keep the score but improve how it's shown
- Use badges: "Essential", "Important", "Supplementary"
- Based on score ranges: 8-10 = Essential, 5-7 = Important, 1-4 = Supplementary
- Cleaner, more meaningful to users

#### Option D: Make It Interactive
- Allow users to adjust importance scores manually
- Use scores to create custom study lists
- "Show only essential terms" filter

### Recommendation
**Option B (Use for Sorting Only)** seems like the best balance:
- Keeps the AI intelligence without UI clutter
- Users benefit from smart ordering without thinking about it
- Can always add display later if users request it

### Implementation (if pursuing Option B)
1. Keep importance field in Term interface
2. Keep API generation of scores
3. Add default sort by importance in GlossaryDisplay
4. Add sort toggle UI (Importance vs Alphabetical)
5. Remove visual display entirely

**Status**: Under review
**Priority**: Low
**Estimated effort**: 1-2 hours (if implementing Option B)

---

## 2. Multiple Glossaries with History Feature

### Overview
Enhance the Glossary Builder to support multiple glossaries with a browsing interface, allowing users to create, save, and manage a collection of glossaries over time.

### Current State (as of Jan 23, 2026)
- ✅ Single active glossary persisted to localStorage
- ✅ Auto-save/load on page refresh
- ✅ Robust localStorage implementation with error handling
- ✅ Term details storage infrastructure (prepared but not actively used)
- ✅ Clean UI foundation ready for expansion
- ✅ Dexie.js already installed (`dexie@4.2.1`) but not yet used
- ❌ No way to save multiple glossaries (new overwrites old)
- ❌ No history or glossary management UI
- ❌ No search/filter functionality
- ❌ No IndexedDB implementation yet

## Proposed Feature
Add the ability to:
1. Save multiple glossaries (each with unique ID and title)
2. Browse and load previously created glossaries
3. Delete glossaries from history
4. Search/filter through saved glossaries
5. Import/export glossaries as JSON files
6. Seamless migration from current localStorage implementation

## UI Mockup (Proposed Design)

**Note:** These are mockups for the future multi-glossary feature. Current UI shows single glossary only.

### Main View - Glossary List (New Screen)
```
┌─────────────────────────────────────────────────────┐
│ Glossary Builder                                    │
│ ─────────────────────────────────────────────────── │
│                                                      │
│ [+ New Glossary]  [Import]  [Search: _________]    │
│                                                      │
│ My Glossaries (12)                                  │
│ ─────────────────────────────────────────────────── │
│                                                      │
│ ┌─────────────────────────────────────────────┐   │
│ │ Machine Learning Fundamentals                │   │
│ │ Created: Jan 15, 2026 • 25 terms             │   │
│ │ Seed: neural network                          │   │
│ │ [Open] [Export] [Delete]                      │   │
│ └─────────────────────────────────────────────┘   │
│                                                      │
│ ┌─────────────────────────────────────────────┐   │
│ │ React Hooks & State Management               │   │
│ │ Created: Jan 20, 2026 • 30 terms             │   │
│ │ Seed: useState                                │   │
│ │ [Open] [Export] [Delete]                      │   │
│ └─────────────────────────────────────────────┘   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Individual Glossary View
```
┌─────────────────────────────────────────────────────┐
│ [← Back to List]           Machine Learning         │
│ ─────────────────────────────────────────────────── │
│                                                      │
│ [Current UI with terms display]                     │
│                                                      │
│ [Add 10 More Terms] [Export] [Save As Copy]         │
└─────────────────────────────────────────────────────┘
```

## Data Model

### Storage Schema (IndexedDB via Dexie)

```typescript
// Database schema
interface GlossaryDatabase extends DBCore {
  glossaries: Table<StoredGlossary>;
}

interface StoredGlossary {
  id: string;                    // UUID (primary key)
  title: string;                 // User-provided title (required)
  description: string;           // AI-generated description
  seedWord: string;              // Original seed word
  terms: Term[];                 // Array of terms
  termDetails: [string, string][]; // Expanded details as array
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last modified timestamp
  termCount: number;             // Computed: terms.length (for sorting)
  tags?: string[];               // Optional: user tags for categorization
}

// Indexes for efficient querying
glossaries.createIndex('createdAt');
glossaries.createIndex('updatedAt');
glossaries.createIndex('termCount');
glossaries.createIndex('title');
```

### Migration from localStorage (Critical for Implementation)

**Important:** When this feature is implemented, existing users may have a glossary saved in localStorage that must not be lost.

**Migration Flow:**
1. On app load, check for migration completion flag
2. If not migrated yet:
   - Check for existing `glossary-builder:glossary` in localStorage
   - If found, automatically migrate to IndexedDB as first saved glossary
   - Show user notification: "Your saved glossary has been added to your library"
   - Set migration completion flag
3. Optionally offer to clear old localStorage (keep as backup initially)

**Implementation in Step 1.2** (see Phase 1 below)

## Implementation Plan

**Note:** This is a detailed implementation plan broken into phases. Each phase builds on the previous one. The simpler approach (per project guidelines) would be to start with Phase 1 & 2 only, then iterate based on user feedback.

### Phase 1: Database Setup (2-3 hours)

#### Step 1.1: Create Dexie Database Wrapper
**File**: `src/utils/database.ts` (new file)

```typescript
import Dexie, { Table } from 'dexie';
import type { Glossary, Term } from '../types/glossary';

interface StoredGlossary {
  id: string;
  title: string;
  description: string;
  seedWord: string;
  terms: Term[];
  termDetails: [string, string][];
  createdAt: Date;
  updatedAt: Date;
  termCount: number;
}

class GlossaryDatabase extends Dexie {
  glossaries!: Table<StoredGlossary>;

  constructor() {
    super('GlossaryBuilderDB');
    this.version(1).stores({
      glossaries: 'id, title, createdAt, updatedAt, termCount, seedWord'
    });
  }
}

export const db = new GlossaryDatabase();

// CRUD operations
export async function saveGlossaryToDb(
  glossary: Glossary,
  termDetails: Map<string, string>
): Promise<void> { /* ... */ }

export async function getAllGlossaries(): Promise<StoredGlossary[]> { /* ... */ }

export async function getGlossaryById(id: string): Promise<StoredGlossary | undefined> { /* ... */ }

export async function deleteGlossary(id: string): Promise<void> { /* ... */ }

export async function searchGlossaries(query: string): Promise<StoredGlossary[]> { /* ... */ }
```

#### Step 1.2: Migrate localStorage to IndexedDB
**File**: `src/utils/migration.ts` (new file)

Handle one-time migration from localStorage to IndexedDB. This is critical since users may have a saved glossary in localStorage that they don't want to lose.

**Migration Flow:**
1. Check if migration has already been completed (flag in localStorage)
2. If not migrated, check for existing glossary in localStorage
3. If found, show user-friendly prompt to migrate
4. Import into IndexedDB as first saved glossary
5. Set migration complete flag
6. Optionally clear old localStorage data (after user confirms)

### Phase 2: UI Components (3-4 hours)

#### Step 2.1: Create Glossary List Component
**File**: `src/components/GlossaryList.tsx` (new file)

Display all saved glossaries in a grid/list view with:
- Glossary card showing title, seed word, term count, dates
- Action buttons: Open, Export, Delete
- Search/filter functionality
- Sort options (by date, by term count, alphabetically)
- Empty state when no glossaries exist
- Responsive design matching current UI aesthetic

#### Step 2.2: Update App.tsx Routing
**File**: `src/App.tsx` (modify existing)

Current state: App.tsx already has clean separation between input and display views.

Add simple state-based routing:
- View mode: "list" | "input" | "display"
- Default to "list" view when app loads
- "Create New" button navigates to "input" view
- After generation, navigate to "display" view
- "Back to List" button returns to "list" view
- Maintain current responsive header and mobile menu

#### Step 2.3: Update GlossaryDisplay Component
**File**: `src/components/GlossaryDisplay.tsx` (modify existing)

Minor updates to existing component:
- Add "Back to List" button in header
- Keep all existing display functionality
- Pass through selected glossary from parent
- No major structural changes needed

#### Step 2.4: Add "Save As" / "Save Copy" Functionality
Allow users to:
- Save current glossary with a new title (prompt for title)
- Create copies of existing glossaries for variation
- Useful for creating glossary variations or templates

### Phase 3: Import/Export (1-2 hours)

#### Step 3.1: JSON Export
Export glossary as standalone JSON file:
```json
{
  "version": "1.0",
  "glossary": {
    "id": "...",
    "title": "...",
    "terms": [...],
    "termDetails": {...}
  }
}
```

#### Step 3.2: JSON Import
- File picker for JSON upload
- Validation of JSON structure
- Import into database with new ID

### Phase 4: Advanced Features (2-3 hours)

#### Step 4.1: Search & Filter
- Full-text search across titles, descriptions, seed words
- Filter by date range
- Filter by term count

#### Step 4.2: Tagging System
- Add optional tags to glossaries
- Filter by tags
- Tag suggestions based on seed word

#### Step 4.3: Batch Operations
- Select multiple glossaries
- Bulk delete
- Bulk export as ZIP file

## Technical Considerations

### Storage Limits
- **IndexedDB**: No hard limit, typically >50MB per domain
- Much larger than localStorage's 5-10MB limit
- Can store hundreds of glossaries

### Performance
- Use Dexie's built-in indexing for fast queries
- Lazy-load glossary list (pagination if >100 glossaries)
- Virtual scrolling for large lists

### Error Handling
- Handle IndexedDB quota errors
- Corrupted data recovery
- Import validation errors
- Conflict resolution (duplicate IDs)

### Data Backup
- Auto-export all glossaries periodically (optional)
- Cloud sync (future enhancement)

## Testing Strategy

### Unit Tests
- Database CRUD operations
- Search/filter logic
- Import/export serialization
- Migration from localStorage

### Integration Tests
- Create → Save → Load flow
- Edit existing glossary flow
- Delete glossary flow
- Import → Edit → Export flow

### Manual Testing
- Create 20+ glossaries, test performance
- Test with very large glossaries (100+ terms)
- Test search with various queries
- Test import with malformed JSON
- Test quota limits (fill database)

## Migration Strategy

### Version 1 → Version 2
1. Detect existing localStorage data on app load
2. Show migration prompt to user
3. Create database entry from localStorage
4. Ask if user wants to delete old localStorage data
5. Mark migration as complete in localStorage flag

### Backwards Compatibility
- Keep current localStorage implementation as fallback
- Detect IndexedDB support (graceful degradation)
- Export functionality remains compatible

## Dependencies

Already installed:
- ✅ `dexie@4.2.1` - IndexedDB wrapper

May need to add:
- `date-fns` - Date formatting/manipulation (optional)
- `fuse.js` - Fuzzy search (optional, for better search)

## Timeline Estimate

| Phase | Task | Estimated Time |
|-------|------|----------------|
| 1 | Database setup & migration | 2-3 hours |
| 2 | UI components | 3-4 hours |
| 3 | Import/export | 1-2 hours |
| 4 | Advanced features | 2-3 hours |
| 5 | Testing & polish | 2-3 hours |
| **Total** | | **10-15 hours** |

## Future Enhancements (v3)

- Cloud sync via Firebase/Supabase
- Collaborative glossaries (sharing)
- Public glossary marketplace
- AI-powered glossary merging
- Related glossaries suggestions
- Version history for glossaries
- Glossary templates
- API for external integrations

## Implementation Priority

**Must Have:**
1. Save multiple glossaries
2. Browse/load saved glossaries
3. Delete glossaries
4. Basic search

**Nice to Have:**
5. Import/export JSON
6. Tagging system
7. Advanced filtering

**Future:**
8. Cloud sync
9. Collaboration
10. Marketplace

## Security Considerations

- Sanitize user inputs (titles, tags)
- Validate imported JSON structure
- Prevent XSS in user-generated content
- Rate limiting for AI API calls (prevent abuse)

## Notes

- This feature significantly expands the app's utility
- Consider adding user authentication in the future
- IndexedDB is the right choice for this scale
- Keep the simple, minimal UI design aesthetic

---

## Recommended Implementation Approach

Per project guidelines (CLAUDE.md #11: "When in plan mode, always suggest the simpler approach for development first"), here's the recommended phased approach:

### MVP (Minimum Viable Product) - Start Here
**Goal:** Enable users to save and browse multiple glossaries

**Scope:**
- ✅ Phase 1: Database Setup (IndexedDB with Dexie)
- ✅ Phase 2: Basic UI Components (List view, routing)
- ✅ Migration from localStorage
- ⏭️ Skip: Advanced features (search, tags, batch operations)

**Estimated Effort:** 5-7 hours

**Benefits:**
- Solves the core problem (can't save multiple glossaries)
- Minimal complexity
- Foundation for future enhancements
- Fast time to value

### Future Iterations (Add After MVP)
**Phase 3:** Import/Export JSON (1-2 hours)
**Phase 4:** Search, filter, tags, batch operations (2-3 hours)

This approach allows for user feedback after the MVP before investing in advanced features that may or may not be needed.

---

**Status**: Backlog - Not yet started
**Last Updated**: 2026-01-23
**Dependencies**: Current localStorage implementation (v1)
**Next Step**: User decision on whether to implement MVP or full feature set
