# Backlog: Future Features & Improvements

This document tracks future enhancements and features under review for the Glossary Builder.

---

## 1. Review: Importance Scale UI/UX

### Current State
- ✅ API generates importance score (1-10) for each term
- ✅ Data model includes `importance` field
- ❌ UI display hidden (previously showed visual dots + "X/10" rating)

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

## Current State
- ✅ Single active glossary persisted to localStorage
- ✅ Auto-save/load on page refresh
- ✅ Term details persistence
- ❌ No way to save multiple glossaries
- ❌ No history or glossary management UI

## Proposed Feature
Add the ability to:
1. Save multiple glossaries with unique names
2. Browse and load previously created glossaries
3. Delete old glossaries
4. Search/filter through saved glossaries
5. Import/export glossaries as JSON files

## UI Mockup

### Main View - Glossary List
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

### Migration from localStorage
When the feature is implemented, migrate the current localStorage glossary to IndexedDB:
1. Check for `glossary-builder:glossary` in localStorage
2. If found, create a new entry in IndexedDB
3. Prompt user: "We found a saved glossary. Would you like to save it to your library?"
4. After migration, clear old localStorage keys

## Implementation Plan

### Phase 1: Database Setup (2-3 hours)

#### Step 1.1: Create Dexie Database Wrapper
**File**: `src/utils/database.ts`

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
**File**: `src/utils/migration.ts`

Handle one-time migration from localStorage to IndexedDB.

### Phase 2: UI Components (3-4 hours)

#### Step 2.1: Create Glossary List Component
**File**: `src/components/GlossaryList.tsx`

Display all saved glossaries in a grid/list view with:
- Glossary card showing title, seed word, term count, dates
- Action buttons: Open, Export, Delete
- Search/filter functionality
- Sort options (by date, by term count, alphabetically)

#### Step 2.2: Update App.tsx Routing
Add simple state-based routing:
- View mode: "list" | "create" | "display"
- Navigation between views
- Pass selected glossary to GlossaryDisplay

#### Step 2.3: Add "Save As" / "Save Copy" Functionality
Allow users to:
- Save current glossary with a new title
- Create copies of existing glossaries for variation

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

**Status**: Backlog - Not yet started
**Last Updated**: 2026-01-22
**Dependencies**: Current localStorage implementation (v1)
