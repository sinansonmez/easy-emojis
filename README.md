# easy-emojis

A comprehensive TypeScript library for emoji utilities including intelligent text-to-emoji replacement, flag conversion, and emoji lookup functions.

## Features

✨ **Smart Text Replacement** - Convert natural language to emojis with contextual awareness  
🔍 **Emoji Lookup** - Find emojis by name, shortname, or get random selections  
🏳️ **Flag Conversion** - Convert between country codes and flag emojis  
🔤 **Letter Conversion** - Transform letters to regional indicator emojis  
⚡ **High Performance** - Optimized for speed with configurable options  
🎯 **TypeScript Support** - Full type definitions included

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

### Basic Emoji Lookup
```javascript
import * as EasyEmojis from 'easy-emojis';

// Get random emoji
EasyEmojis.getRandomEmoji(); // returns a random emoji like '🎉'

// Lookup by name or shortname
EasyEmojis.getEmojiByName('red apple'); // returns '🍎'
EasyEmojis.getEmojiByShortName(':apple:'); // returns '🍎'

// Universal lookup (accepts both name and shortname)
EasyEmojis.getEmoji('red apple'); // returns '🍎'
EasyEmojis.getEmoji(':apple:'); // returns '🍎'
```

### Flag & Letter Conversion
```javascript
// Country code to flag conversion
EasyEmojis.countryCodeToFlag('US'); // returns '🇺🇸'
EasyEmojis.flagToCountryCode('🇺🇸'); // returns 'US'

// Letter to regional indicator emoji
EasyEmojis.letterToEmoji('S'); // returns '🇸'
EasyEmojis.emojiToLetter('🇸'); // returns 'S'
```

## 🚀 New: Smart Text Replacement

Transform your text with intelligent emoji replacements! Perfect for social media, chat applications, and creative content.

### Basic Usage
```javascript
import { replaceTextWithEmojis } from 'easy-emojis';

const result = replaceTextWithEmojis("I love pizza and coffee!");
console.log(result.text); // "I ❤️ 🍕 and ☕!"
```

### Replacement Modes

Choose from different replacement strategies:

```javascript
import { 
  replaceTextSubtle,     // Conservative approach
  replaceTextBalanced,   // Moderate replacements  
  replaceTextExpressive, // More aggressive
  replaceTextSmart       // Context-aware
} from 'easy-emojis';

const text = "Having a great morning with coffee and friends!";

replaceTextSubtle(text);     // "Having a great morning with ☕ and friends!"
replaceTextBalanced(text);   // "Having a great morning with ☕ and friends!"
replaceTextExpressive(text); // "Having a great 🌅 with ☕ and friends!"
replaceTextSmart(text);      // Context-aware replacements based on sentiment
```

### Advanced Configuration

```javascript
import { replaceTextWithEmojis, EmojiReplaceMode } from 'easy-emojis';

const result = replaceTextWithEmojis("I love programming and pizza", {
  mode: EmojiReplaceMode.MODERATE,
  confidenceThreshold: 0.8,
  maxReplacements: 3,
  categories: ['food', 'emotion', 'tech'], // Only replace food and emotion words
  customMappings: {
    'programming': { emoji: '💻', confidence: 0.9, category: 'tech' }
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

```typescript
interface EmojiReplaceOptions {
  mode: EmojiReplaceMode;           // Replacement strategy
  confidenceThreshold: number;      // Minimum confidence (0-1)
  maxReplacements?: number;         // Limit total replacements
  preserveCase?: boolean;           // Maintain original casing
  categories?: string[];            // Filter by emoji categories
  customMappings?: object;          // Add your own word→emoji mappings
}
```

### Return Value

```typescript
interface EmojiReplaceResult {
  text: string;                     // Transformed text
  replacements: EmojiReplacement[]; // Detailed replacement info
  originalText: string;             // Original input
  stats: {
    totalReplacements: number;
    averageConfidence: number;
    categoriesUsed: string[];
  };
}
```

## API Reference

### Core Functions

| Function | Description | Example |
|----------|-------------|---------|
| `getRandomEmoji()` | Returns a random emoji | `🎲` |
| `getEmojiByName(name)` | Find emoji by name | `getEmojiByName('pizza')` → `🍕` |
| `getEmojiByShortName(shortname)` | Find emoji by shortname | `getEmojiByShortName(':pizza:')` → `🍕` |
| `getEmoji(query)` | Universal emoji lookup | `getEmoji('pizza')` or `getEmoji(':pizza:')` |

### Conversion Functions

| Function | Description | Example |
|----------|-------------|---------|
| `countryCodeToFlag(code)` | Country code → flag | `countryCodeToFlag('JP')` → `🇯🇵` |
| `flagToCountryCode(flag)` | Flag → country code | `flagToCountryCode('🇯🇵')` → `JP` |
| `letterToEmoji(letter)` | Letter → regional indicator | `letterToEmoji('A')` → `🇦` |
| `emojiToLetter(emoji)` | Regional indicator → letter | `emojiToLetter('🇦')` → `A` |

### Text Replacement Functions

| Function | Description |
|----------|-------------|
| `replaceTextWithEmojis(text, options)` | Advanced replacement with full control |
| `replaceTextSubtle(text)` | Conservative preset |
| `replaceTextBalanced(text)` | Moderate preset |
| `replaceTextExpressive(text)` | Aggressive preset |
| `replaceTextSmart(text)` | Context-aware preset |

## Real-World Examples

### Social Media Enhancement
```javascript
const post = "Just finished an amazing workout! Time for coffee and relaxation.";
const enhanced = replaceTextBalanced(post);
// "Just finished an amazing workout! Time for ☕ and relaxation. 😊"
```

### Chat Application
```javascript
const message = "Good morning! Having breakfast - eggs and coffee";
const fun = replaceTextExpressive(message);
// "🌅! Having breakfast - 🥚 and ☕"
```

### Email Subject Lines
```javascript
const subject = "Meeting tomorrow - pizza lunch provided";
const professional = replaceTextSubtle(subject);
// "Meeting tomorrow - 🍕 lunch provided"
```

## Performance

- ⚡ **Fast**: Optimized regex patterns and efficient algorithms
- 🔄 **Memory efficient**: Smart caching and minimal footprint
- 📦 **Lightweight**: Tree-shakeable ES modules
- 🎯 **Scalable**: Handles large texts efficiently

### Development Setup

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
npm run test        # Run all tests
```

## License

MIT © [Sinan Chaush](https://github.com/sinansonmez)
