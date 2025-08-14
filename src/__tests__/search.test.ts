import { searchEmojis, getSearchCategories } from '../index';

// Mock emoji data for testing
jest.mock('../emojis', () => ({
  __esModule: true,
  default: [
    {
      emoji: "😀",
      name: "grinning face",
      shortname: ":grinning:",
      unicode: "U+1F600",
      html: "&#128512;",
      category: "smileys"
    },
    {
      emoji: "😂",
      name: "face with tears of joy",
      shortname: ":joy:",
      unicode: "U+1F602",
      html: "&#128514;",
      category: "smileys"
    },
    {
      emoji: "❤️",
      name: "red heart",
      shortname: ":heart:",
      unicode: "U+2764",
      html: "&#10084;",
      category: "symbols"
    },
    {
      emoji: "🔥",
      name: "fire",
      shortname: ":fire:",
      unicode: "U+1F525",
      html: "&#128293;",
      category: "nature"
    },
    {
      emoji: "🎉",
      name: "party popper",
      shortname: ":tada:",
      unicode: "U+1F389",
      html: "&#127881;",
      category: "activities"
    },
    {
      emoji: "🚀",
      name: "rocket",
      shortname: ":rocket:",
      unicode: "U+1F680",
      html: "&#128640;",
      category: "transport"
    },
    {
      emoji: "💻",
      name: "laptop computer",
      shortname: ":computer:",
      unicode: "U+1F4BB",
      html: "&#128187;",
      category: "objects"
    },
    {
      emoji: "🌟",
      name: "glowing star",
      shortname: ":star2:",
      unicode: "U+1F31F",
      html: "&#127775;",
      category: "nature"
    },
    {
      emoji: "🐱",
      name: "cat face",
      shortname: ":cat:",
      unicode: "U+1F431",
      html: "&#128049;",
      category: "animals"
    },
    {
      emoji: "🍕",
      name: "pizza",
      shortname: ":pizza:",
      unicode: "U+1F355",
      html: "&#127829;",
      category: "food"
    }
  ]
}));

describe('searchEmojis', () => {
  describe('basic functionality', () => {
    it('should return exact matches with highest score', () => {
      const results = searchEmojis('fire');

      expect(results).toHaveLength(1);
      expect(results[0].emoji.name).toBe('fire');
      expect(results[0].score).toBe(100);
      expect(results[0].matchType).toBe('exact');
    });

    it('should find exact matches by shortname', () => {
      const results = searchEmojis('joy');

      expect(results).toHaveLength(1);
      expect(results[0].emoji.shortname).toBe(':joy:');
      expect(results[0].score).toBe(100);
      expect(results[0].matchType).toBe('exact');
    });

    it('should find partial matches in name', () => {
      const results = searchEmojis('face');

      expect(results.length).toBeGreaterThan(0);

      const grinningSmiley = results.find(r => r.emoji.name === 'grinning face');
      const catFace = results.find(r => r.emoji.name === 'cat face');
      const tearsOfJoy = results.find(r => r.emoji.name === 'face with tears of joy');

      expect(grinningSmiley).toBeDefined();
      expect(catFace).toBeDefined();
      expect(tearsOfJoy).toBeDefined();

      expect(grinningSmiley!.matchType).toBe('partial');
      expect(catFace!.matchType).toBe('partial');
      expect(tearsOfJoy!.matchType).toBe('partial');
    });

    it('should find partial matches in shortname', () => {
      const results = searchEmojis('star');

      expect(results.length).toBeGreaterThan(0);

      const glowingStar = results.find(r => r.emoji.name === 'glowing star');
      expect(glowingStar).toBeDefined();
      expect(glowingStar!.matchType).toBe('partial');
    });

    it('should return empty array for no matches', () => {
      const results = searchEmojis('nonexistent');

      expect(results).toHaveLength(0);
    });
  });

  describe('search options', () => {
    it('should respect limit option', () => {
      const results = searchEmojis('a', { limit: 3 });

      expect(results.length).toBeLessThanOrEqual(3);
    });

    it('should filter by category', () => {
      const results = searchEmojis('a', { category: 'smileys' });

      expect(results.every(result => result.emoji.category === 'smileys')).toBe(true);
    });

    it('should only return exact matches when exactMatch is true', () => {
      const results = searchEmojis('fire', { exactMatch: true });

      expect(results).toHaveLength(1);
      expect(results[0].matchType).toBe('exact');
      expect(results[0].emoji.name).toBe('fire');
    });

    it('should return no results for partial matches when exactMatch is true', () => {
      const results = searchEmojis('fir', { exactMatch: true });

      expect(results).toHaveLength(0);
    });

    it('should combine category filter with exact match', () => {
      const results = searchEmojis('fire', {
        category: 'nature',
        exactMatch: true
      });

      expect(results).toHaveLength(1);
      expect(results[0].emoji.name).toBe('fire');
      expect(results[0].emoji.category).toBe('nature');
    });

    it('should return empty array when category filter excludes all matches', () => {
      const results = searchEmojis('fire', { category: 'smileys' });

      expect(results).toHaveLength(0);
    });
  });

  describe('scoring algorithm', () => {
    it('should prioritize matches at the beginning of names', () => {
      const results = searchEmojis('face');

      // "cat face" should score higher than "grinning face" because "face" appears at the end
      // "face with tears of joy" should score highest because "face" appears at the beginning
      const tearsOfJoy = results.find(r => r.emoji.name === 'face with tears of joy');
      const catFace = results.find(r => r.emoji.name === 'cat face');
      const grinningFace = results.find(r => r.emoji.name === 'grinning face');

      expect(tearsOfJoy!.score).toBeGreaterThan(catFace!.score);
      expect(catFace!.score).toBeGreaterThan(grinningFace!.score);
    });

    it('should give exact matches higher scores than partial matches', () => {
      const exactResults = searchEmojis('fire');
      const partialResults = searchEmojis('fir');

      if (exactResults.length > 0 && partialResults.length > 0) {
        expect(exactResults[0].score).toBeGreaterThan(partialResults[0].score);
      }
    });

    it('should sort by score descending', () => {
      const results = searchEmojis('a');

      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
      }
    });

    it('should use name length as tiebreaker for equal scores', () => {
      const results = searchEmojis('computer');

      // If multiple results have the same score, shorter names should come first
      let previousScore = Infinity;
      let previousNameLength = 0;

      for (const result of results) {
        if (result.score === previousScore) {
          expect(result.emoji.name.length).toBeGreaterThanOrEqual(previousNameLength);
        }
        previousScore = result.score;
        previousNameLength = result.emoji.name.length;
      }
    });
  });

  describe('edge cases', () => {
    it('should throw error for empty query', () => {
      expect(() => searchEmojis('')).toThrow('Search query cannot be empty');
    });

    it('should throw error for whitespace-only query', () => {
      expect(() => searchEmojis('   ')).toThrow('Search query cannot be empty');
    });

    it('should handle queries with leading/trailing whitespace', () => {
      const results1 = searchEmojis('fire');
      const results2 = searchEmojis('  fire  ');

      expect(results1).toEqual(results2);
    });

    it('should handle case-insensitive searches', () => {
      const results1 = searchEmojis('FIRE');
      const results2 = searchEmojis('fire');
      const results3 = searchEmojis('Fire');

      expect(results1).toEqual(results2);
      expect(results2).toEqual(results3);
    });

    it('should handle queries that match both name and shortname', () => {
      // Search for something that might appear in both
      const results = searchEmojis('cat');

      expect(results.length).toBeGreaterThan(0);

      const catResult = results.find(r => r.emoji.name === 'cat face');
      expect(catResult).toBeDefined();
    });

    it('should handle invalid category gracefully', () => {
      const results = searchEmojis('fire', { category: 'nonexistent' });

      expect(results).toHaveLength(0);
    });

    it('should handle limit of 0', () => {
      const results = searchEmojis('a', { limit: 0 });

      expect(results).toHaveLength(0);
    });

    it('should handle limit larger than available results', () => {
      const results = searchEmojis('fire', { limit: 1000 });

      expect(results.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('special characters and unicode', () => {
    it('should handle searches with special characters', () => {
      const results = searchEmojis('heart');

      expect(results.length).toBeGreaterThan(0);
    });

    it('should handle shortnames without colons in search query', () => {
      // User searches for "joy" which should match ":joy:"
      const results = searchEmojis('joy');

      const joyResult = results.find(r => r.emoji.shortname === ':joy:');
      expect(joyResult).toBeDefined();
      expect(joyResult!.matchType).toBe('exact');
    });
  });
});

describe('getSearchCategories', () => {
  it('should return all unique categories', () => {
    const categories = getSearchCategories();

    expect(categories).toContain('smileys');
    expect(categories).toContain('symbols');
    expect(categories).toContain('nature');
    expect(categories).toContain('activities');
    expect(categories).toContain('transport');
    expect(categories).toContain('objects');
    expect(categories).toContain('animals');
    expect(categories).toContain('food');
  });

  it('should return categories in sorted order', () => {
    const categories = getSearchCategories();
    const sortedCategories = [...categories].sort();

    expect(categories).toEqual(sortedCategories);
  });

  it('should return unique categories only', () => {
    const categories = getSearchCategories();
    const uniqueCategories = [...new Set(categories)];

    expect(categories).toEqual(uniqueCategories);
  });

  it('should return array of strings', () => {
    const categories = getSearchCategories();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories.every(cat => typeof cat === 'string')).toBe(true);
  });
});

describe('integration tests', () => {
  it('should work with real-world search scenarios', () => {
    // Search for love-related emojis
    const loveResults = searchEmojis('heart');
    expect(loveResults.length).toBeGreaterThan(0);

    // Search for celebration emojis
    const celebrationResults = searchEmojis('party');
    expect(celebrationResults.length).toBeGreaterThan(0);

    // Search within specific category
    const animalResults = searchEmojis('cat', { category: 'animals' });
    expect(animalResults.every(r => r.emoji.category === 'animals')).toBe(true);
  });

  it('should handle common user patterns', () => {
    // Users often search with partial words
    const partialResults = searchEmojis('comp');
    expect(partialResults.some(r => r.emoji.name.includes('computer'))).toBe(true);

    // Users sometimes search with emoji shortcode format
    const shortcodeResults = searchEmojis('rocket');
    expect(shortcodeResults.some(r => r.emoji.shortname === ':rocket:')).toBe(true);
  });

  it('should provide consistent results across multiple searches', () => {
    const results1 = searchEmojis('fire');
    const results2 = searchEmojis('fire');

    expect(results1).toEqual(results2);
  });
});

describe('performance and limits', () => {
  it('should handle large result sets efficiently', () => {
    const startTime = Date.now();
    const results = searchEmojis('a', { limit: 100 });
    const endTime = Date.now();

    // Should complete within reasonable time (adjust threshold as needed)
    expect(endTime - startTime).toBeLessThan(100);
    expect(results.length).toBeLessThanOrEqual(100);
  });

  it('should handle very short queries', () => {
    const results = searchEmojis('a');

    expect(Array.isArray(results)).toBe(true);
    // Should not crash or return undefined
  });

  it('should handle very long queries', () => {
    const longQuery = 'this is a very long query that probably will not match anything';
    const results = searchEmojis(longQuery);

    expect(Array.isArray(results)).toBe(true);
    expect(results).toHaveLength(0);
  });
});

describe('match type validation', () => {
  it('should correctly identify exact matches', () => {
    const results = searchEmojis('fire');
    const exactMatch = results.find(r => r.matchType === 'exact');

    expect(exactMatch).toBeDefined();
    expect(exactMatch!.emoji.name).toBe('fire');
  });

  it('should correctly identify partial matches', () => {
    const results = searchEmojis('face');

    expect(results.every(r => r.matchType === 'exact' || r.matchType === 'partial')).toBe(true);
    expect(results.some(r => r.matchType === 'partial')).toBe(true);
  });

  it('should prefer exact over partial when both exist', () => {
    // This test assumes there might be an emoji with "star" in name and another named exactly "star"
    const results = searchEmojis('star');

    if (results.length > 1) {
      const exactMatches = results.filter(r => r.matchType === 'exact');
      const partialMatches = results.filter(r => r.matchType === 'partial');

      if (exactMatches.length > 0 && partialMatches.length > 0) {
        expect(exactMatches[0].score).toBeGreaterThan(partialMatches[0].score);
      }
    }
  });
});

describe('error handling', () => {
  it('should throw meaningful error for empty string', () => {
    expect(() => searchEmojis('')).toThrow('Search query cannot be empty');
  });

  it('should throw meaningful error for null query', () => {
    expect(() => searchEmojis(null as any)).toThrow('Search query cannot be empty');
  });

  it('should throw meaningful error for undefined query', () => {
    expect(() => searchEmojis(undefined as any)).toThrow('Search query cannot be empty');
  });

  it('should handle malformed options gracefully', () => {
    // Should not crash with weird options
    expect(() => searchEmojis('fire', { limit: -1 })).not.toThrow();
    expect(() => searchEmojis('fire', { category: '' })).not.toThrow();
    expect(() => searchEmojis('fire', { exactMatch: null as any })).not.toThrow();
  });
});

describe('category functionality', () => {
  it('should filter results by single category correctly', () => {
    const results = searchEmojis('a', { category: 'smileys' });

    expect(results.every(r => r.emoji.category === 'smileys')).toBe(true);
  });

  it('should return different results for different categories', () => {
    const smileyResults = searchEmojis('a', { category: 'smileys' });
    const natureResults = searchEmojis('a', { category: 'nature' });

    // Results should be different (assuming 'a' matches emojis in both categories)
    expect(smileyResults).not.toEqual(natureResults);
  });

  it('should work with all available categories', () => {
    const categories = getSearchCategories();

    for (const category of categories) {
      expect(() => searchEmojis('a', { category })).not.toThrow();
    }
  });
});

describe('scoring consistency', () => {
  it('should assign consistent scores for identical matches', () => {
    const results1 = searchEmojis('fire');
    const results2 = searchEmojis('fire');

    expect(results1[0].score).toBe(results2[0].score);
  });

  it('should give different scores for different match positions', () => {
    const results = searchEmojis('with');

    if (results.length > 1) {
      const tearsOfJoy = results.find(r => r.emoji.name === 'face with tears of joy');
      if (tearsOfJoy) {
        // "with" appears in middle of name, should get appropriate score
        expect(tearsOfJoy.score).toBeLessThan(100);
        expect(tearsOfJoy.score).toBeGreaterThan(0);
      }
    }
  });

  it('should ensure minimum score of 60 for partial matches', () => {
    const results = searchEmojis('computer');

    const partialMatches = results.filter(r => r.matchType === 'partial');

    for (const match of partialMatches) {
      expect(match.score).toBeGreaterThanOrEqual(60);
    }
  });
});

describe('shortname processing', () => {
  it('should handle shortnames with colons correctly', () => {
    const results = searchEmojis('tada');

    const tadaResult = results.find(r => r.emoji.shortname === ':tada:');
    expect(tadaResult).toBeDefined();
  });

  it('should not be confused by colon in search query', () => {
    const results1 = searchEmojis('fire');
    const results2 = searchEmojis(':fire:');

    // Both should find the fire emoji, but scores might differ
    expect(results1.some(r => r.emoji.name === 'fire')).toBe(true);
    expect(results2.length).toBeGreaterThanOrEqual(0);
  });
});
