// todo
// update readme
// publish new version

export enum EmojiReplaceMode {
  CONSERVATIVE = 'conservative',
  MODERATE = 'moderate',
  AGGRESSIVE = 'aggressive',
  CONTEXTUAL = 'contextual'
}

export enum EmojiCategories {
  FOOD = 'food',
  EMOTION = 'emotion',
  ACTIVITY = 'activity',
  NATURE = 'nature',
  ANIMAL = 'animal',
  TECH = 'tech',
  TRANSPORT = 'transport',
  TIME = 'time',
  PHRASE = 'phrase'
}

// Type for a single emoji mapping entry
interface EmojiMapping {
  emoji: string;
  confidence: number;
  category: EmojiCategories
}

export interface EmojiReplaceOptions {
  mode: EmojiReplaceMode;
  confidenceThreshold: number;
  maxReplacements?: number;
  preserveCase?: boolean;
  categories?: EmojiCategories[];
  customMappings?: Record<string, { emoji: string; confidence: number; category: EmojiCategories }>;
}

export interface EmojiReplacement {
  original: string;
  emoji: string;
  position: number;
  confidence: number;
  category: EmojiCategories;
}

export interface EmojiReplaceResult {
  text: string;
  replacements: EmojiReplacement[];
  originalText: string;
  stats: {
    totalReplacements: number;
    averageConfidence: number;
    categoriesUsed: EmojiCategories[];
  };
}

// Mapping of common words/phrases to emojis with confidence scores
const EMOJI_MAPPINGS: Record<string, EmojiMapping>  = {
  // Emotions & Feelings
  'love': { emoji: '❤️', confidence: 0.9, category: EmojiCategories.EMOTION },
  'heart': { emoji: '💖', confidence: 0.8, category: EmojiCategories.EMOTION },
  'happy': { emoji: '😊', confidence: 0.8, category: EmojiCategories.EMOTION },
  'sad': { emoji: '😢', confidence: 0.8, category: EmojiCategories.EMOTION },
  'angry': { emoji: '😠', confidence: 0.8, category: EmojiCategories.EMOTION },
  'excited': { emoji: '🎉', confidence: 0.7, category: EmojiCategories.EMOTION },
  'tired': { emoji: '😴', confidence: 0.7, category: EmojiCategories.EMOTION },
  'scared': { emoji: '😨', confidence: 0.7, category: EmojiCategories.EMOTION },
  'laugh': { emoji: '😂', confidence: 0.8, category: EmojiCategories.EMOTION },
  'smile': { emoji: '😊', confidence: 0.8, category: EmojiCategories.EMOTION },

  // Food & Drinks
  'pizza': { emoji: '🍕', confidence: 0.9, category: EmojiCategories.FOOD },
  'burger': { emoji: '🍔', confidence: 0.9, category: EmojiCategories.FOOD },
  'coffee': { emoji: '☕', confidence: 0.9, category: EmojiCategories.FOOD },
  'beer': { emoji: '🍺', confidence: 0.9, category: EmojiCategories.FOOD },
  'wine': { emoji: '🍷', confidence: 0.9, category: EmojiCategories.FOOD },
  'cake': { emoji: '🎂', confidence: 0.9, category: EmojiCategories.FOOD },
  'apple': { emoji: '🍎', confidence: 0.9, category: EmojiCategories.FOOD },
  'banana': { emoji: '🍌', confidence: 0.9, category: EmojiCategories.FOOD },
  'ice cream': { emoji: '🍦', confidence: 0.9, category: EmojiCategories.FOOD },
  'chocolate': { emoji: '🍫', confidence: 0.8, category: EmojiCategories.FOOD },

  // Activities & Sports
  'soccer': { emoji: '⚽', confidence: 0.9, category: EmojiCategories.ACTIVITY },
  'football': { emoji: '🏈', confidence: 0.8, category: EmojiCategories.ACTIVITY },
  'basketball': { emoji: '🏀', confidence: 0.9, category: EmojiCategories.ACTIVITY },
  'swimming': { emoji: '🏊‍♀️', confidence: 0.8, category: EmojiCategories.ACTIVITY },
  'running': { emoji: '🏃‍♂️', confidence: 0.8, category: EmojiCategories.ACTIVITY },
  'music': { emoji: '🎵', confidence: 0.8, category: EmojiCategories.ACTIVITY },
  'dance': { emoji: '💃', confidence: 0.8, category: EmojiCategories.ACTIVITY },
  'party': { emoji: '🎉', confidence: 0.8, category: EmojiCategories.ACTIVITY },
  'birthday': { emoji: '🎂', confidence: 0.8, category: EmojiCategories.ACTIVITY },
  'celebration': { emoji: '🎊', confidence: 0.8, category: EmojiCategories.ACTIVITY },

  // Nature & Weather
  'sun': { emoji: '☀️', confidence: 0.9, category: EmojiCategories.NATURE },
  'rain': { emoji: '🌧️', confidence: 0.9, category: EmojiCategories.NATURE },
  'snow': { emoji: '❄️', confidence: 0.9, category: EmojiCategories.NATURE },
  'fire': { emoji: '🔥', confidence: 0.9, category: EmojiCategories.NATURE },
  'water': { emoji: '💧', confidence: 0.8, category: EmojiCategories.NATURE },
  'tree': { emoji: '🌳', confidence: 0.9, category: EmojiCategories.NATURE },
  'flower': { emoji: '🌸', confidence: 0.9, category: EmojiCategories.NATURE },
  'mountain': { emoji: '⛰️', confidence: 0.8, category: EmojiCategories.NATURE },
  'ocean': { emoji: '🌊', confidence: 0.8, category: EmojiCategories.NATURE },
  'star': { emoji: '⭐', confidence: 0.9, category: EmojiCategories.NATURE },

  // Animals
  'cat': { emoji: '🐱', confidence: 0.9, category: EmojiCategories.ANIMAL },
  'dog': { emoji: '🐶', confidence: 0.9, category: EmojiCategories.ANIMAL },
  'bird': { emoji: '🐦', confidence: 0.8, category: EmojiCategories.ANIMAL },
  'fish': { emoji: '🐟', confidence: 0.8, category: EmojiCategories.ANIMAL },
  'elephant': { emoji: '🐘', confidence: 0.9, category: EmojiCategories.ANIMAL },
  'lion': { emoji: '🦁', confidence: 0.9, category: EmojiCategories.ANIMAL },
  'monkey': { emoji: '🐒', confidence: 0.9, category: EmojiCategories.ANIMAL },
  'bear': { emoji: '🐻', confidence: 0.9, category: EmojiCategories.ANIMAL },
  'rabbit': { emoji: '🐰', confidence: 0.9, category: EmojiCategories.ANIMAL },
  'horse': { emoji: '🐎', confidence: 0.9, category: EmojiCategories.ANIMAL },

  // Transportation
  'car': { emoji: '🚗', confidence: 0.9, category: EmojiCategories.TRANSPORT },
  'train': { emoji: '🚆', confidence: 0.9, category: EmojiCategories.TRANSPORT },
  'plane': { emoji: '✈️', confidence: 0.9, category: EmojiCategories.TRANSPORT },
  'bike': { emoji: '🚲', confidence: 0.9, category: EmojiCategories.TRANSPORT },
  'bus': { emoji: '🚌', confidence: 0.9, category: EmojiCategories.TRANSPORT },
  'ship': { emoji: '🚢', confidence: 0.9, category: EmojiCategories.TRANSPORT },
  'rocket': { emoji: '🚀', confidence: 0.9, category: EmojiCategories.TRANSPORT },

  // Time & Events
  'morning': { emoji: '🌅', confidence: 0.7, category: EmojiCategories.TIME },
  'night': { emoji: '🌙', confidence: 0.8, category: EmojiCategories.TIME },
  'weekend': { emoji: '🎉', confidence: 0.6, category: EmojiCategories.TIME },
  'holiday': { emoji: '🏖️', confidence: 0.7, category: EmojiCategories.TIME },
  'christmas': { emoji: '🎄', confidence: 0.9, category: EmojiCategories.TIME },
  'halloween': { emoji: '🎃', confidence: 0.9, category: EmojiCategories.TIME },

  // Technology
  'phone': { emoji: '📱', confidence: 0.9, category: EmojiCategories.TECH },
  'computer': { emoji: '💻', confidence: 0.9, category: EmojiCategories.TECH },
  'internet': { emoji: '🌐', confidence: 0.8, category: EmojiCategories.TECH },
  'camera': { emoji: '📷', confidence: 0.9, category: EmojiCategories.TECH },
  'email': { emoji: '📧', confidence: 0.9, category: EmojiCategories.TECH },

  // Common phrases
  'good luck': { emoji: '🍀', confidence: 0.8, category: EmojiCategories.PHRASE },
  'thank you': { emoji: '🙏', confidence: 0.8, category: EmojiCategories.PHRASE },
  'congratulations': { emoji: '🎉', confidence: 0.8, category: EmojiCategories.PHRASE },
  'good morning': { emoji: '🌅', confidence: 0.8, category: EmojiCategories.PHRASE },
  'good night': { emoji: '🌙', confidence: 0.8, category: EmojiCategories.PHRASE },
  'well done': { emoji: '👏', confidence: 0.8, category: EmojiCategories.PHRASE },
  'yes': { emoji: '✅', confidence: 0.7, category: EmojiCategories.PHRASE },
  'no': { emoji: '❌', confidence: 0.7, category: EmojiCategories.PHRASE },
  'okay': { emoji: '👌', confidence: 0.7, category: EmojiCategories.PHRASE },
  'thumbs up': { emoji: '👍', confidence: 0.9, category: EmojiCategories.PHRASE },
  'thumbs down': { emoji: '👎', confidence: 0.9, category: EmojiCategories.PHRASE }
};

/**
 * Replaces text with emojis based on configurable modes and confidence levels
 * @param text The input text to process
 * @param options Configuration options for replacement behavior
 * @returns Result object with transformed text and metadata
 */
export const replaceTextWithEmojis = (
  text: string,
  options: Partial<EmojiReplaceOptions> = {}
): EmojiReplaceResult => {
  // Default options based on mode
  const defaultOptions: EmojiReplaceOptions = {
    mode: EmojiReplaceMode.MODERATE,
    confidenceThreshold: getModeDefaults(options.mode || EmojiReplaceMode.MODERATE).confidenceThreshold,
    maxReplacements: getModeDefaults(options.mode || EmojiReplaceMode.MODERATE).maxReplacements,
    preserveCase: false,
    categories: getModeDefaults(options.mode || EmojiReplaceMode.MODERATE).categories
  };

  const config = { ...defaultOptions, ...options };

  // Merge custom mappings with default ones
  const mappings = { ...EMOJI_MAPPINGS, ...(config.customMappings || {}) };

  // Filter mappings by categories and confidence
  const filteredMappings = Object.entries(mappings).filter(([_, data]) => {
    return data.confidence >= config.confidenceThreshold &&
      (config.categories?.length === 0 || config.categories?.includes(data.category));
  });

  // Sort by phrase length (longest first) to avoid partial matches
  const sortedMappings = filteredMappings.sort(([a], [b]) => b.length - a.length);

  let processedText = text;
  const replacements: EmojiReplacement[] = [];
  let replacementCount = 0;

  // Track positions to handle overlapping matches
  const usedPositions = new Set<number>();

  for (const [phrase, data] of sortedMappings) {
    if (config.maxReplacements && replacementCount >= config.maxReplacements) {
      break;
    }

    const regex = createPhraseRegex(phrase, config.preserveCase);
    let match;

    while ((match = regex.exec(processedText)) !== null) {
      const startPos = match.index;
      const endPos = startPos + match[0].length;

      // Check for position conflicts
      let hasConflict = false;
      for (let i = startPos; i < endPos; i++) {
        if (usedPositions.has(i)) {
          hasConflict = true;
          break;
        }
      }

      if (!hasConflict) {
        // Mark positions as used
        for (let i = startPos; i < endPos; i++) {
          usedPositions.add(i);
        }

        // Apply contextual analysis if needed
        if (config.mode === EmojiReplaceMode.CONTEXTUAL) {
          const contextScore = analyzeContext(processedText, startPos, phrase);
          if (contextScore < 0.5) {
            continue; // Skip this replacement based on context
          }
        }

        replacements.push({
          original: match[0],
          emoji: data.emoji,
          position: startPos,
          confidence: data.confidence,
          category: data.category
        });

        replacementCount++;

        if (config.maxReplacements && replacementCount >= config.maxReplacements) {
          break;
        }
      }
    }
  }

  // Sort replacements by position (descending) to replace from end to start
  replacements.sort((a, b) => b.position - a.position);

  // Apply replacements
  for (const replacement of replacements) {
    const before = processedText.substring(0, replacement.position);
    const after = processedText.substring(replacement.position + replacement.original.length);
    processedText = before + replacement.emoji + after;
  }

  // Calculate statistics
  const stats = {
    totalReplacements: replacements.length,
    averageConfidence: replacements.length > 0
      ? replacements.reduce((sum, r) => sum + r.confidence, 0) / replacements.length
      : 0,
    categoriesUsed: Array.from(new Set(replacements.map(r => r.category)))
  };

  return {
    text: processedText,
    replacements: replacements.reverse(), // Return in original order
    originalText: text,
    stats
  };
};

/**
 * Get default settings for each mode
 */
function getModeDefaults(mode: EmojiReplaceMode): Pick<EmojiReplaceOptions, 'confidenceThreshold' | 'maxReplacements' | 'categories'> {
  switch (mode) {
    case EmojiReplaceMode.CONSERVATIVE:
      return {
        confidenceThreshold: 0.9,
        maxReplacements: 3,
        categories: [EmojiCategories.FOOD, EmojiCategories.EMOTION]
      };
    case EmojiReplaceMode.MODERATE:
      return {
        confidenceThreshold: 0.8,
        maxReplacements: 5,
        categories: [
          EmojiCategories.FOOD,
          EmojiCategories.EMOTION,
          EmojiCategories.ACTIVITY,
          EmojiCategories.NATURE,
          EmojiCategories.ANIMAL,
          EmojiCategories.TECH,
          EmojiCategories.TRANSPORT,
          EmojiCategories.TIME,
          EmojiCategories.PHRASE,
        ],
      };
    case EmojiReplaceMode.AGGRESSIVE:
      return {
        confidenceThreshold: 0.6,
        maxReplacements: 10,
        categories: []
      };
    case EmojiReplaceMode.CONTEXTUAL:
      return {
        confidenceThreshold: 0.7,
        maxReplacements: 7,
        categories: []
      };
    default:
      return {
        confidenceThreshold: 0.8,
        maxReplacements: 5,
        categories: []
      };
  }
}

/**
 * Create regex for phrase matching
 */
function createPhraseRegex(phrase: string, preserveCase?: boolean): RegExp {
  const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const flags = preserveCase ? 'g' : 'gi';
  return new RegExp(`\\b${escapedPhrase}\\b`, flags);
}

/**
 * Analyze context around a potential replacement (simplified implementation)
 */
function analyzeContext(text: string, position: number, phrase: string): number {
  const contextWindow = 50;
  const start = Math.max(0, position - contextWindow);
  const end = Math.min(text.length, position + phrase.length + contextWindow);
  const context = text.substring(start, end).toLowerCase();

  // Simple sentiment and context analysis
  const negativeWords = ['not', 'never', 'dont', "don't", 'without', 'except', 'but'];
  const positiveWords = ['really', 'very', 'absolutely', 'definitely', 'totally'];

  let score = 0.7; // Base score

  // Check for negation
  for (const neg of negativeWords) {
    if (context.includes(neg)) {
      score -= 0.3;
    }
  }

  // Check for emphasis
  for (const pos of positiveWords) {
    if (context.includes(pos)) {
      score += 0.2;
    }
  }

  return Math.max(0, Math.min(1, score));
}

// Example usage and helper functions
export const presets = {
  subtle: {
    mode: EmojiReplaceMode.CONSERVATIVE,
    confidenceThreshold: 0.9,
    maxReplacements: 2
  },
  balanced: {
    mode: EmojiReplaceMode.MODERATE,
    confidenceThreshold: 0.8,
    maxReplacements: 5
  },
  expressive: {
    mode: EmojiReplaceMode.AGGRESSIVE,
    confidenceThreshold: 0.6,
    maxReplacements: 8
  },
  smart: {
    mode: EmojiReplaceMode.CONTEXTUAL,
    confidenceThreshold: 0.7,
    maxReplacements: 6
  }
};

/**
 * Quick preset functions for common use cases
 */
export const replaceTextSubtle = (text: string) =>
  replaceTextWithEmojis(text, presets.subtle);

export const replaceTextBalanced = (text: string) =>
  replaceTextWithEmojis(text, presets.balanced);

export const replaceTextExpressive = (text: string) =>
  replaceTextWithEmojis(text, presets.expressive);

export const replaceTextSmart = (text: string) =>
  replaceTextWithEmojis(text, presets.smart);
