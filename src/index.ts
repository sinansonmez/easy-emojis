import emojis from './emojis';
import { isShortName } from './utils';
export {
  EmojiCategories,
  EmojiReplaceMode,
  EmojiReplaceOptions,
  EmojiReplacement,
  EmojiReplaceResult,
  replaceTextWithEmojis,
  replaceTextSubtle,
  replaceTextBalanced,
  replaceTextExpressive,
  replaceTextSmart
} from './replaceText';

export { searchEmojis, getSearchCategories } from './search'

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
  return String.fromCodePoint(emoji.codePointAt(0)! - OFFSET);
};

export const getRandomEmoji = (): string => {
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex].emoji;
};

export const getEmoji = (emoji: string): string => {
  if (isShortName(emoji)) {
    return getEmojiByShortName(emoji);
  } else {
    return getEmojiByName(emoji);
  }
};

export const getEmojiByName = (emojiName: string): string => {
  const foundEmoji = emojis.find((emoji) => emoji.name === emojiName?.toLowerCase());
  if (foundEmoji) {
    return foundEmoji.emoji;
  } else {
    console.warn('emoji not found with name: ', emojiName);
    return '';
  }
};

export const getEmojiByShortName = (emojiShortName: string): string => {
  if (!isShortName(emojiShortName.toLowerCase())) {
    console.error('you didnt pass a short name. Please pass correct short name like :apple: or use getEmojiByName');
    return '';
  }
  const foundEmoji = emojis.find((emoji) => emoji.shortname === emojiShortName?.toLowerCase());
  if (foundEmoji) {
    return foundEmoji.emoji;
  } else {
    console.warn('emoji not found with name: ', emojiShortName);
    return '';
  }
};
