import {
  EmojiCategories,
  EmojiReplaceMode,
  presets,
  replaceTextBalanced,
  replaceTextExpressive,
  replaceTextSmart,
  replaceTextSubtle,
  replaceTextWithEmojis,
} from '../replaceText';

describe('replaceTextWithEmojis', () => {
  describe('Basic functionality', () => {
    test('should replace single word with emoji', () => {
      const result = replaceTextWithEmojis('I love pizza');

      expect(result.text).toContain('❤️');
      expect(result.text).toContain('🍕');
      expect(result.replacements).toHaveLength(2);
      expect(result.originalText).toBe('I love pizza');
      expect(result.stats.totalReplacements).toBe(2);
    });

    test('should handle empty string', () => {
      const result = replaceTextWithEmojis('');

      expect(result.text).toBe('');
      expect(result.replacements).toHaveLength(0);
      expect(result.stats.totalReplacements).toBe(0);
    });

    test('should handle text with no replaceable words', () => {
      const result = replaceTextWithEmojis('The quick brown fox jumps');

      expect(result.text).toBe('The quick brown fox jumps');
      expect(result.replacements).toHaveLength(0);
      expect(result.stats.totalReplacements).toBe(0);
    });

    test('should preserve word boundaries', () => {
      const result = replaceTextWithEmojis('I love my lovely cat');

      // Should replace 'love' but not 'love' in 'lovely'
      expect(result.text).toMatch(/❤️.*lovely.*🐱/);
      expect(result.replacements).toHaveLength(2);
    });
  });

  describe('Replacement modes', () => {
    const testText = 'I love pizza and coffee on a sunny morning with my cat';

    test('conservative mode should make fewer replacements', () => {
      const result = replaceTextWithEmojis(testText, {
        mode: EmojiReplaceMode.CONSERVATIVE,
      });

      expect(result.replacements.length).toBeLessThanOrEqual(3);
      expect(result.stats.averageConfidence).toBeGreaterThan(0.8);
    });

    test('moderate mode should make balanced replacements', () => {
      const result = replaceTextWithEmojis(testText, {
        mode: EmojiReplaceMode.MODERATE,
      });

      expect(result.replacements.length).toBeLessThanOrEqual(5);
      expect(result.stats.averageConfidence).toBeGreaterThan(0.7);
    });

    test('aggressive mode should make more replacements', () => {
      const result = replaceTextWithEmojis(testText, {
        mode: EmojiReplaceMode.AGGRESSIVE,
      });

      expect(result.replacements.length).toBeGreaterThan(3);
      expect(result.stats.averageConfidence).toBeGreaterThan(0.5);
    });

    test('contextual mode should analyze context', () => {
      const positiveContext = replaceTextWithEmojis('I really love pizza', {
        mode: EmojiReplaceMode.CONTEXTUAL,
      });

      const negativeContext = replaceTextWithEmojis('I do not love pizza', {
        mode: EmojiReplaceMode.CONTEXTUAL,
      });

      // Contextual mode should make different decisions based on context
      expect(positiveContext.replacements.length).toBeGreaterThanOrEqual(negativeContext.replacements.length);
    });
  });

  describe('Configuration options', () => {
    test('should respect confidence threshold', () => {
      const highThreshold = replaceTextWithEmojis('I love pizza and coffee', {
        confidenceThreshold: 0.95,
      });

      const lowThreshold = replaceTextWithEmojis('I love pizza and coffee', {
        confidenceThreshold: 0.5,
      });

      expect(lowThreshold.replacements.length).toBeGreaterThanOrEqual(highThreshold.replacements.length);
    });

    test('should respect max replacements limit', () => {
      const result = replaceTextWithEmojis('I love pizza and coffee and cake and ice cream and chocolate', {
        maxReplacements: 2,
      });

      expect(result.replacements).toHaveLength(2);
      expect(result.stats.totalReplacements).toBe(2);
    });

    test('should filter by categories', () => {
      const foodOnly = replaceTextWithEmojis('I love pizza and my cat', {
        categories: [EmojiCategories.FOOD],
      });

      const emotionOnly = replaceTextWithEmojis('I love pizza and my cat', {
        categories: [EmojiCategories.EMOTION],
      });

      // Food-only should replace pizza but not love/cat
      expect(foodOnly.text).toContain('🍕');
      expect(foodOnly.stats.categoriesUsed).toContain('food');
      expect(foodOnly.stats.categoriesUsed).not.toContain('emotion');

      // Emotion-only should replace love but not pizza/cat
      expect(emotionOnly.text).toContain('❤️');
      expect(emotionOnly.stats.categoriesUsed).toContain('emotion');
      expect(emotionOnly.stats.categoriesUsed).not.toContain('food');
    });

    test('should handle custom mappings', () => {
      const result = replaceTextWithEmojis('I love programming', {
        customMappings: {
          programming: { emoji: '💻', confidence: 0.9, category: EmojiCategories.TECH },
        },
      });

      expect(result.text).toContain('💻');
      expect(result.stats.categoriesUsed).toContain('tech');
    });

    test('should preserve case when enabled', () => {
      const withCase = replaceTextWithEmojis('I LOVE pizza', {
        preserveCase: true,
      });

      const withoutCase = replaceTextWithEmojis('I LOVE pizza', {
        preserveCase: false,
      });

      // Both should make replacements, but behavior might differ
      expect(withCase.replacements.length).toBeGreaterThan(0);
      expect(withoutCase.replacements.length).toBeGreaterThan(0);
    });
  });

  describe('Multi-word phrases', () => {
    test('should prioritize longer phrases over shorter words', () => {
      const result = replaceTextWithEmojis('Good morning sunshine');

      // Should replace 'good morning' as phrase, not just 'morning'
      expect(result.text).toContain('🌅');

      const morningReplacement = result.replacements.find((r) => r.original.toLowerCase().includes('morning'));
      expect(morningReplacement?.original.toLowerCase()).toBe('good morning');
    });

    test('should handle overlapping matches correctly', () => {
      const result = replaceTextWithEmojis('ice cream and cream');

      // Should not double-replace 'cream' in 'ice cream'
      const creamReplacements = result.replacements.filter((r) => r.original.toLowerCase().includes('cream'));
      expect(creamReplacements).toHaveLength(1);
    });
  });

  describe('Edge cases', () => {
    test('should handle special characters and punctuation', () => {
      const result = replaceTextWithEmojis('I love pizza! Do you love coffee?');

      expect(result.text).toContain('❤️');
      expect(result.text).toContain('🍕');
      expect(result.text).toContain('☕');
      expect(result.replacements.length).toBeGreaterThan(0);
    });

    test('should handle repeated words', () => {
      const result = replaceTextWithEmojis('I love love love pizza');

      // Should replace all instances of 'love'
      const loveCount = (result.text.match(/❤️/g) || []).length;
      expect(loveCount).toBe(3);
    });

    test('should handle case insensitive matching', () => {
      const result = replaceTextWithEmojis('I LOVE Pizza And COFFEE');

      expect(result.text).toContain('❤️');
      expect(result.text).toContain('🍕');
      expect(result.text).toContain('☕');
    });

    test('should maintain text structure with whitespace', () => {
      const result = replaceTextWithEmojis('I    love     pizza');

      // Should preserve spacing structure
      expect(result.text).toMatch(/I\s+❤️\s+🍕/);
    });
  });

  describe('Return value structure', () => {
    test('should return complete EmojiReplaceResult', () => {
      const result = replaceTextWithEmojis('I love pizza');

      // Check result structure
      expect(result).toHaveProperty('text');
      expect(result).toHaveProperty('replacements');
      expect(result).toHaveProperty('originalText');
      expect(result).toHaveProperty('stats');

      // Check stats structure
      expect(result.stats).toHaveProperty('totalReplacements');
      expect(result.stats).toHaveProperty('averageConfidence');
      expect(result.stats).toHaveProperty('categoriesUsed');

      expect(typeof result.stats.totalReplacements).toBe('number');
      expect(typeof result.stats.averageConfidence).toBe('number');
      expect(Array.isArray(result.stats.categoriesUsed)).toBe(true);
    });

    test('should return detailed replacement information', () => {
      const result = replaceTextWithEmojis('I love pizza');

      expect(result.replacements.length).toBeGreaterThan(0);

      result.replacements.forEach((replacement) => {
        expect(replacement).toHaveProperty('original');
        expect(replacement).toHaveProperty('emoji');
        expect(replacement).toHaveProperty('position');
        expect(replacement).toHaveProperty('confidence');
        expect(replacement).toHaveProperty('category');

        expect(typeof replacement.original).toBe('string');
        expect(typeof replacement.emoji).toBe('string');
        expect(typeof replacement.position).toBe('number');
        expect(typeof replacement.confidence).toBe('number');
        expect(typeof replacement.category).toBe('string');

        expect(replacement.confidence).toBeGreaterThan(0);
        expect(replacement.confidence).toBeLessThanOrEqual(1);
      });
    });

    test('should calculate statistics correctly', () => {
      const result = replaceTextWithEmojis('I love pizza and coffee');

      expect(result.stats.totalReplacements).toBe(result.replacements.length);

      if (result.replacements.length > 0) {
        const manualAverage =
          result.replacements.reduce((sum, r) => sum + r.confidence, 0) / result.replacements.length;

        expect(result.stats.averageConfidence).toBeCloseTo(manualAverage, 5);

        const uniqueCategories = result.replacements.map(r => r.category);
        expect(result.stats.categoriesUsed).toEqual(expect.arrayContaining(uniqueCategories));
      }
    });
  });

  describe('Preset functions', () => {
    const testText = 'I love pizza and coffee in the morning with my cat';

    test('replaceTextSubtle should use conservative settings', () => {
      const result = replaceTextSubtle(testText);

      expect(result.replacements.length).toBeLessThanOrEqual(presets.subtle.maxReplacements);
      expect(result.stats.averageConfidence).toBeGreaterThanOrEqual(presets.subtle.confidenceThreshold);
    });

    test('replaceTextBalanced should use moderate settings', () => {
      const result = replaceTextBalanced(testText);

      expect(result.replacements.length).toBeLessThanOrEqual(presets.balanced.maxReplacements);
    });

    test('replaceTextExpressive should use aggressive settings', () => {
      const result = replaceTextExpressive(testText);

      expect(result.replacements.length).toBeLessThanOrEqual(presets.expressive.maxReplacements);
      // Should generally make more replacements than conservative
      const conservative = replaceTextSubtle(testText);
      expect(result.replacements.length).toBeGreaterThanOrEqual(conservative.replacements.length);
    });

    test('replaceTextSmart should use contextual settings', () => {
      const result = replaceTextSmart(testText);

      expect(result.replacements.length).toBeLessThanOrEqual(presets.smart.maxReplacements);
    });
  });

  describe('Performance and edge cases', () => {
    test('should handle very long text efficiently', () => {
      const longText = 'I love pizza '.repeat(1000);

      const start = performance.now();
      const result = replaceTextWithEmojis(longText);
      const end = performance.now();

      expect(end - start).toBeLessThan(1000); // Should complete in under 1 second
      expect(result.replacements.length).toBeGreaterThan(0);
    });

    test('should handle text with no spaces', () => {
      const result = replaceTextWithEmojis('IlovepizzaandcoffeeandcakeandIcream');

      // Should not make any replacements due to word boundaries
      expect(result.replacements).toHaveLength(0);
    });

    test('should handle unicode characters', () => {
      const result = replaceTextWithEmojis('I love pizza 🎉 and coffee');

      expect(result.text).toContain('❤️');
      expect(result.text).toContain('🍕');
      expect(result.text).toContain('☕');
      expect(result.text).toContain('🎉'); // Should preserve existing emojis
    });
  });
});

// Integration tests
describe('Integration scenarios', () => {

  test('social media post transformation', () => {
    const post = "Just had amazing pizza for lunch! Love spending time with friends and coffee afterwards. So happy!";
    const result = replaceTextWithEmojis(post, {
      mode: EmojiReplaceMode.MODERATE,
      maxReplacements: 4
    });

    expect(result.text).toContain('🍕');
    expect(result.text).toContain('❤️');
    expect(result.text).toContain('☕');
    expect(result.stats.totalReplacements).toBeLessThanOrEqual(4);
  });

  test('email subject line enhancement', () => {
    const subject = "Meeting tomorrow morning - coffee and cake provided";
    const result = replaceTextWithEmojis(subject, {
      mode: EmojiReplaceMode.CONSERVATIVE,
      maxReplacements: 2,
      categories: [EmojiCategories.FOOD, EmojiCategories.TIME]
    });

    expect(result.replacements.length).toBeLessThanOrEqual(2);
    expect(result.stats.categoriesUsed).toEqual(
      expect.arrayContaining(['food'])
    );
  });

  test('chat message personalization', () => {
    const messages = [
      "Good morning!",
      "Love the new design",
      "Going to the beach this weekend",
      "Happy birthday to you!"
    ];

    messages.forEach(message => {
      const result = replaceTextBalanced(message);
      expect(result.text).toBeDefined();
      expect(result.originalText).toBe(message);
    });
  });

});

// Helper function tests
describe('Helper functions and utilities', () => {

  test('presets should have correct structure', () => {
    Object.values(presets).forEach(preset => {
      expect(preset).toHaveProperty('mode');
      expect(preset).toHaveProperty('confidenceThreshold');
      expect(preset).toHaveProperty('maxReplacements');

      expect(Object.values(EmojiReplaceMode)).toContain(preset.mode);
      expect(preset.confidenceThreshold).toBeGreaterThan(0);
      expect(preset.confidenceThreshold).toBeLessThanOrEqual(1);
      expect(preset.maxReplacements).toBeGreaterThan(0);
    });
  });

  test('should handle malformed custom mappings gracefully', () => {
    const result = replaceTextWithEmojis('test word', {
      customMappings: {
        'test': { emoji: '🧪', confidence: 1.5, category: EmojiCategories.TECH }, // Invalid confidence
        'word': { emoji: '', confidence: 0.8, category: EmojiCategories.TECH } // Empty emoji
      }
    });

    // Should handle gracefully without crashing
    expect(result).toBeDefined();
    expect(result.text).toBeDefined();
  });

});
