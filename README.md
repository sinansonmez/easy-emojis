# easy-emojis

A comprehensive TypeScript library for emoji utilities including intelligent text-to-emoji replacement, fast search, flag conversion, and emoji lookup functions.

[![npm version](https://img.shields.io/npm/v/easy-emojis.svg)](https://www.npmjs.com/package/easy-emojis)
[![npm downloads](https://img.shields.io/npm/dm/easy-emojis.svg)](https://www.npmjs.com/package/easy-emojis)
[![License](https://img.shields.io/npm/l/easy-emojis.svg)](LICENSE)

## Features

✨ **Smart Text Replacement** – Convert natural language to emojis with contextual awareness  
🔎 **Emoji Search (new!)** – Ranked results with exact/partial matching, category filters, limits  
🔍 **Emoji Lookup** – Find emojis by name, shortname, or get random selections  
🏳️ **Flag Conversion** – Convert between country codes and flag emojis  
🔤 **Letter Conversion** – Transform letters to regional indicator emojis  
⚡ **High Performance** – Optimized algorithms with configurable options  
🎯 **TypeScript Support** – Full type definitions

## Installation

```bash
# npm
npm install easy-emojis

# yarn
yarn add easy-emojis

# pnpm
pnpm add easy-emojis
```

## Quick Start

```ts
import * as EasyEmojis from 'easy-emojis';

// Lookup
EasyEmojis.getEmoji('pizza');        // 🍕
EasyEmojis.getEmoji(':coffee:');     // ☕

// NEW: Search
EasyEmojis.searchEmojis('apple')[0]?.emoji.emoji; // 🍎 (top match)

// Flags & Letters
EasyEmojis.countryCodeToFlag('JP');  // 🇯🇵
EasyEmojis.letterToEmoji('S');       // 🇸
```

---

## 🔎 New: Emoji Search

Ranked search with optional category filtering, strict (exact) mode, and result limits.

### Basic Usage

```ts
import { searchEmojis } from 'easy-emojis';

const results = searchEmojis('apple');
/*
[
  { emoji: { ...🍎 }, score: 100, matchType: 'exact' },
  { emoji: { ...🍏 }, score:  78, matchType: 'partial' },
  ...
]
*/

// Just the emoji characters:
const chars = results.map(r => r.emoji.emoji); // ["🍎","🍏",...]
```

### Shortnames & Names

- Searches match **names** (e.g., `"red apple"`) and **shortnames** (without colons), e.g. `"apple"`.
- Exact matches on name/shortname score **100**.

```ts
searchEmojis('tada');  // treats shortname; exact if it matches 🎉
```

### Exact Match Mode

```ts
searchEmojis('red apple', { exactMatch: true });
// returns only exact name/shortname matches (score = 100)
```

### Category Filtering

```ts
import { getSearchCategories, searchEmojis } from 'easy-emojis';

const categories = getSearchCategories(); // ["People & Body (family)", "Food & Drink (food-sweet)" ...]
const food = searchEmojis('cake', { category: 'Food & Drink (food-sweet)' });
```

> Tip: Use `getSearchCategories()` to present a category dropdown and pass the selected value to `searchEmojis`.

### Limiting Results

```ts
searchEmojis('face', { limit: 10 });
```

### Scoring & Sorting (How results are ranked)

- **Exact match (name or shortname)** → `score = 100`, `matchType: 'exact'`.
- **Partial match** → `score ∈ [60..90]`, higher if the match occurs earlier in the text.
    - Name partials are prioritized over shortname partials.
- Secondary sort by **shorter name length** to bias simpler names when scores tie.

### Error Handling

- Empty or whitespace‐only queries throw: `Error("Search query cannot be empty")`.

---

## Emoji Lookup

```ts
import * as EasyEmojis from 'easy-emojis';

// Get random emoji
EasyEmojis.getRandomEmoji(); // e.g. "🎉"

// Lookup by name or shortname
EasyEmojis.getEmojiByName('red apple'); // "🍎"
EasyEmojis.getEmojiByShortName(':apple:'); // "🍎"

// Universal lookup (accepts both)
EasyEmojis.getEmoji('red apple'); // "🍎"
EasyEmojis.getEmoji(':apple:');   // "🍎"
```

---

## Flag & Letter Conversion

```ts
import * as EasyEmojis from 'easy-emojis';

EasyEmojis.countryCodeToFlag('US'); // "🇺🇸"
EasyEmojis.flagToCountryCode('🇺🇸'); // "US"

EasyEmojis.letterToEmoji('S'); // "🇸"
EasyEmojis.emojiToLetter('🇸'); // "S"
```

---

## 🚀 Smart Text Replacement

Transform your text with intelligent emoji replacements! Perfect for social media, chat apps, and creative content.

### Basic Usage

```ts
import { replaceTextWithEmojis } from 'easy-emojis';

const result = replaceTextWithEmojis("I love pizza and coffee!");
console.log(result.text); // "I ❤️ 🍕 and ☕!"
```

### Replacement Presets

```ts
import {
  replaceTextSubtle,     // Conservative
  replaceTextBalanced,   // Moderate
  replaceTextExpressive, // Aggressive
  replaceTextSmart       // Context-aware
} from 'easy-emojis';

const text = "Having a great morning with coffee and friends!";

replaceTextSubtle(text);     // "Having a great morning with ☕ and friends!"
replaceTextBalanced(text);   // "Having a great morning with ☕ and friends!"
replaceTextExpressive(text); // "Having a great 🌅 with ☕ and friends!"
replaceTextSmart(text);      // Context-aware replacements based on sentiment
```

### Advanced Configuration

```ts
import { replaceTextWithEmojis, EmojiReplaceMode } from 'easy-emojis';

const result = replaceTextWithEmojis("I love programming and pizza", {
  mode: EmojiReplaceMode.MODERATE,
  confidenceThreshold: 0.8,
  maxReplacements: 3,
  categories: ['food', 'emotion', 'tech'],
  customMappings: {
    programming: { emoji: '💻', confidence: 0.9, category: 'tech' }
  }
});

console.log(result.text); // "I ❤️💻 and 🍕"
console.log(result.stats);
// {
//   totalReplacements: 3,
//   averageConfidence: 0.9,
//   categoriesUsed: ['emotion', 'tech', 'food']
// }
```

### Replacement Modes Explained

| Mode | Description | Use Case |
|------|-------------|----------|
| `CONSERVATIVE` | High-confidence, minimal replacements | Professional communication |
| `MODERATE` | Balanced approach with good coverage | Social media posts |
| `AGGRESSIVE` | Maximum replacements, lower threshold | Creative content, casual chat |
| `CONTEXTUAL` | AI-powered context analysis | Smart assistants, adaptive UX |

### Configuration Options

```ts
interface EmojiReplaceOptions {
  mode: EmojiReplaceMode;
  confidenceThreshold: number;
  maxReplacements?: number;
  preserveCase?: boolean;
  categories?: string[];
  customMappings?: object;
}
```

### Return Value

```ts
interface EmojiReplaceResult {
  text: string;
  replacements: EmojiReplacement[];
  originalText: string;
  stats: {
    totalReplacements: number;
    averageConfidence: number;
    categoriesUsed: string[];
  };
}
```

---

## API Reference

### Core

| Function | Description | Example |
|---------|-------------|---------|
| `getRandomEmoji()` | Returns a random emoji | `🎲` |
| `getEmojiByName(name)` | Find emoji by name | `getEmojiByName('pizza')` → `🍕` |
| `getEmojiByShortName(shortname)` | Find by shortname | `getEmojiByShortName(':pizza:')` → `🍕` |
| `getEmoji(query)` | Universal lookup (name or shortname) | `getEmoji('pizza')` → `🍕` |

### Search (new)

| Function | Description | Example |
|---------|-------------|---------|
| `searchEmojis(query, options?)` | Ranked search across names & shortnames | `searchEmojis('apple', { limit: 10 })` |
| `getSearchCategories()` | List available categories (sorted) | `getSearchCategories()` → `string[]` |

**`SearchOptions`**

```ts
type SearchOptions = {
  limit?: number;       // default 50
  category?: string;    // exact category string
  exactMatch?: boolean; // only exact matches when true
};
```

**`SearchResult`**

```ts
type SearchResult = {
  emoji: Emoji;
  score: number;                 // 100 exact; 60–90 partial
  matchType: 'exact' | 'partial';
};
```

### Conversion

| Function | Description | Example |
|---------|-------------|---------|
| `countryCodeToFlag(code)` | Country code → flag | `countryCodeToFlag('JP')` → `🇯🇵` |
| `flagToCountryCode(flag)` | Flag → country code | `flagToCountryCode('🇯🇵')` → `JP` |
| `letterToEmoji(letter)` | Letter → regional indicator | `letterToEmoji('A')` → `🇦` |
| `emojiToLetter(emoji)` | Regional indicator → letter | `emojiToLetter('🇦')` → `A` |

### Text Replacement

| Function | Description |
|---------|-------------|
| `replaceTextWithEmojis(text, options)` | Advanced replacement with full control |
| `replaceTextSubtle(text)` | Conservative preset |
| `replaceTextBalanced(text)` | Moderate preset |
| `replaceTextExpressive(text)` | Aggressive preset |
| `replaceTextSmart(text)` | Context-aware preset |

---

## Real-World Examples

### Typeahead / Autocomplete with Search

```ts
import { searchEmojis } from 'easy-emojis';

function suggest(query: string) {
  if (!query.trim()) return [];
  return searchEmojis(query, { limit: 8 }).map(r => ({
    char: r.emoji.emoji,
    name: r.emoji.name,
    shortname: r.emoji.shortname,
    score: r.score
  }));
}
```

### Social Media Enhancement

```ts
const post = "Just finished an amazing workout! Time for coffee and relaxation.";
const enhanced = replaceTextBalanced(post);
// "Just finished an amazing workout! Time for ☕ and relaxation."
```

### Chat Application

```ts
const message = "Good morning! Having breakfast - eggs and coffee";
const fun = replaceTextExpressive(message);
// "🌅! Having breakfast - 🥚 and ☕"
```

### Email Subject Lines

```ts
const subject = "Meeting tomorrow - pizza lunch provided";
const professional = replaceTextSubtle(subject);
// "Meeting tomorrow - 🍕 lunch provided"
```

---

## Performance

- ⚡ **Fast**: O(N) scoring over the (optionally filtered) dataset, plus a single sort on the result set
- 🔄 **Memory efficient**: Smart data shapes and minimal overhead
- 📦 **Lightweight**: Tree-shakeable ES modules
- 🎯 **Scalable**: Handles large texts efficiently

---

## Development Setup

```bash
# Clone the repository
git clone https://github.com/sinansonmez/easy-emojis.git

# Install dependencies
npm install

# Run tests
npm run test

# Build the project
npm run build
```

### Running Tests

```bash
npm run test
```

---

## License

MIT © [Sinan Chaush](https://github.com/sinansonmez)

---

### Changelog

- **vNext** – Added `searchEmojis()` and `getSearchCategories()` with ranked results, exact/partial matching, category filters, and result limits.
