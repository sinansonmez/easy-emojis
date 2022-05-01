// offset between uppercase ascii and regional indicator symbols
const OFFSET = 127397;

export const countryCodeToFlag = (countryCode: string): string => {
  return countryCode.toUpperCase().replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + OFFSET));
};

export const flagToCountryCode = (flag: string): string => {
  return flag.replace(/../g, (cp) => String.fromCodePoint(cp.codePointAt(0)! - OFFSET));
};

export const letterToEmoji = (letter: string): string => {
  if (letter.length !== 1) throw new Error('letterToEmoji: letter must be a single character');
  return String.fromCodePoint(letter.toUpperCase().charCodeAt(0) + OFFSET);
};

export const emojiToLetter = (emoji: string): string => {
  if (emoji.length !== 1) throw new Error('emojiToLetter: emoji must be a single character');
  return String.fromCodePoint(emoji.codePointAt(0)! - OFFSET);
};
