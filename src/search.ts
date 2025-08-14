import emojis from './emojis';

interface Emoji {
  emoji: string;
  name: string;
  shortname: string;
  unicode: string;
  html: string;
  category: string;
}

interface SearchOptions {
  limit?: number;
  category?: string;
  exactMatch?: boolean;
}

interface SearchResult {
  emoji: Emoji;
  score: number;
  matchType: 'exact' | 'partial';
}

/**
 * Calculate relevance score for an emoji based on search query
 */
const calculateScore = (emoji: Emoji, query: string): { score: number; matchType: SearchResult['matchType'] } => {
  const normalizedQuery = query.toLowerCase().trim();
  const normalizedShortname = emoji.shortname.toLowerCase().slice(1, -1); // Remove colons
  const normalizedName = emoji.name.toLowerCase();

  // Exact name match gets highest score
  if (normalizedName === normalizedQuery ||
    normalizedShortname === normalizedQuery
  ) {
    return { score: 100, matchType: 'exact' };
  }

  const getPartialScore = (text: string): number => {
    if (text.includes(normalizedQuery)) {
      const position = text.indexOf(normalizedQuery);
      return Math.max(90 - (position * 2), 60);
    }
    return 0;
  };

  // Check partial matches (prioritize name over shortname)
  const nameScore = getPartialScore(normalizedName);
  const shortnameScore = getPartialScore(normalizedShortname);

  const maxScore = Math.max(nameScore, shortnameScore);

  if (maxScore > 0) {
    return { score: maxScore, matchType: 'partial' };
  }

  return { score: 0, matchType: 'partial' };
};
/**
 * Get all available emoji categories
 */
export const getSearchCategories = (): string[] => {
  const categories = [...new Set(emojis.map(emoji => emoji.category))];
  return categories.sort();
};

/**
 * Search for emojis based on query string
 */
export const searchEmojis = (
  query: string,
  options: SearchOptions = {}
): SearchResult[] => {
  // Validate inputs
  if (!query || query.trim().length === 0) {
    throw new Error("Search query cannot be empty");
  }

  const { limit = 50, category, exactMatch = false } = options;

  // Filter by category if specified
  const filteredDatabase = category
    ? emojis.filter(emoji => emoji.category === category)
    : emojis;

  // Score and filter emojis
  const results: SearchResult[] = [];

  for (const emoji of filteredDatabase) {
    const { score, matchType } = calculateScore(emoji, query);

    if (score > 0) {
      // For exact match mode, only include exact matches
      if (exactMatch && matchType !== 'exact') {
        continue;
      }

      results.push({
        emoji,
        score,
        matchType
      });
    }
  }

  // Sort by score (descending) and return limited results
  return results
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // Secondary sort by name length (shorter names first)
      return a.emoji.name.length - b.emoji.name.length;
    })
    .slice(0, limit);
};
