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

## Definition Rules

### Two-Sentence Structure
1. **Sentence 1**: WHAT it is (category + distinguishing characteristic)
2. **Sentence 2**: WHY it matters or HOW it's used

### Writing Guidelines
- Start with "A/An [category]..." or "The [noun/process]..." to immediately classify
- Never use the term being defined within its own definition
- Avoid vague quantifiers ("various", "different", "many") - be specific
- For abstract concepts, include one concrete example or analogy
- **Maximum 50 words** per definition
- Each definition should be understandable without reading other definitions first

### Example of a Good Definition
```
Term: Gradient Descent
Definition: An optimization algorithm that iteratively adjusts parameters by
moving in the direction of steepest decrease of a loss function. It forms the
foundation of how neural networks learn from training data.
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
