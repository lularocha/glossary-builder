# Glossary Generation Quality Rules

These rules are embedded in the Claude prompt (`api/generate.ts`) to ensure consistent, high-quality glossary output.

---

## Term Selection Rules

### Hierarchical Coverage
Balance the 12 terms across difficulty levels:
- **3-4 foundational terms** (importance 9-10): Building blocks you can't understand the topic without
- **4-5 core concepts** (importance 7-8): Central ideas that define the domain
- **3-4 practical/applied terms** (importance 5-7): How concepts are used in practice

### Selection Principles
1. The **seed word MUST be the first term** with importance 10
2. Include foundational "atoms" (smallest building blocks of the concept)
3. Before including a specialized variant, ensure its parent category exists
   - Example: Include "Activation Function" before "ReLU"
4. Prefer canonical/historical terms over informal names
   - Example: "Perceptron" over "Artificial Neuron"
5. Terms should form a logical learning progression from foundational to advanced

---

## Formatting Rules

### Term Name Casing
- **Abbreviations/acronyms**: Always written in ALL UPPERCASE (e.g., "API", "BASH", "HTML", "REST")
- **Regular terms**: Use standard title case (e.g., "Gradient Descent", "Neural Network")

If the seed word is entered as an abbreviation, it should remain uppercase as the term name in the generated glossary.

---

## Definition Rules

### Standard Structure (Regular Terms)
1. **Sentence 1**: WHAT it is (category + distinguishing characteristic)
2. **Sentence 2**: WHY it matters or HOW it's used

### Abbreviation/Acronym Structure
For terms that are abbreviations or acronyms:
1. **Sentence 1**: State what it stands for (e.g., "API stands for Application Programming Interface.")
2. **Line break** (`\n`)
3. **Sentence 2**: WHAT it is (category + key characteristic)
4. **Sentence 3**: WHY it matters or HOW it's used

### Writing Guidelines
- Start with "A/An [category]..." or "The [noun/process]..." to immediately classify
- Never use the term being defined within its own definition
- Avoid vague quantifiers ("various", "different", "many") - be specific
- For abstract concepts, include one concrete example or analogy
- **Maximum 50 words** per definition (expansion sentence for abbreviations not counted toward limit)
- Each definition should be understandable without reading other definitions first

### Example of a Good Definition (Regular Term)
```
Term: Gradient Descent
Definition: An optimization algorithm that iteratively adjusts parameters by
moving in the direction of steepest decrease of a loss function. It forms the
foundation of how neural networks learn from training data.
```

### Example of a Good Definition (Abbreviation)
```
Term: API
Definition: API stands for Application Programming Interface.
A set of protocols and tools that defines how software components should interact.
Essential for creating modular, interoperable systems that can communicate across
different platforms.
```

---

## Importance Score Calibration

| Score | Meaning | Example (Neural Networks) |
|-------|---------|---------------------------|
| 10 | The seed word itself | Neural Network |
| 9 | Absolute prerequisites - cannot understand topic without | Weights, Activation Function |
| 8 | Core concepts central to the domain | Backpropagation, Loss Function |
| 7 | Important supporting concepts | Gradient Descent, Overfitting |
| 6 | Commonly encountered related terms | Dropout, Batch Normalization |
| 5 | Specialized or advanced topics | LSTM, Attention Mechanism |

---

## Consistency Rules

1. **No orphan references**: All `relatedTerms` MUST reference terms that exist in the glossary
2. **Bidirectional relationships**: If Term A lists Term B as related, Term B should also list Term A (where logical)
3. **Consistent grammar**: All definitions should start with an article + noun/gerund

---

## API Configuration

These settings in `api/generate.ts` support quality output:

| Setting | Value | Purpose |
|---------|-------|---------|
| `model` | claude-sonnet-4-20250514 | Balanced quality and speed |
| `temperature` | 0.7 | Reduces variability while maintaining creativity |
| `max_tokens` | 4096 | Sufficient for 12 detailed terms |

---

## Learn More / Term Expansion (`api/expand.ts`)

The "Learn More" feature allows users to expand any term with additional context and source citations.

### Endpoint

`POST /api/expand`

### Request Body

```json
{
  "term": "API",
  "definition": "API stands for Application Programming Interface...",
  "glossaryTitle": "Working with APIs",
  "seedWord": "API"
}
```

### Response

```json
{
  "paragraphs": [
    "First paragraph of additional context...",
    "Second paragraph with practical details..."
  ],
  "sources": [
    {
      "name": "MDN Web Docs - Web APIs",
      "url": "https://developer.mozilla.org/en-US/docs/Web/API",
      "description": "Comprehensive documentation on Web APIs"
    },
    {
      "name": "OpenAPI Specification",
      "description": "Industry standard for API documentation"
    }
  ],
  "generatedAt": "2026-01-25T12:00:00.000Z"
}
```

### Expansion Content Rules

1. **Paragraphs**: 1-3 paragraphs, each 40-80 words
   - Expand on practical applications or use cases
   - Explain common patterns or best practices
   - Clarify nuances or edge cases
   - Do NOT repeat the original definition

2. **Source Citations**: 1-3 sources from reliable categories only:
   - Official documentation (language/framework docs)
   - MDN Web Docs (for web technologies)
   - W3C specifications
   - RFCs and official standards
   - Reputable publisher documentation (Oracle, Microsoft, Google)

3. **URL Rules**:
   - **NEVER** include Wikipedia links
   - Only include URL if highly confident it exists and is stable
   - If unsure about URL validity, provide source name without URL
   - Prefer stable documentation paths over dated blog posts

### API Configuration (expand.ts)

| Setting | Value | Purpose |
|---------|-------|---------|
| `model` | claude-sonnet-4-20250514 | Consistent with generate endpoint |
| `temperature` | 0.7 | Balanced creativity |
| `max_tokens` | 2048 | Sufficient for expanded content |
