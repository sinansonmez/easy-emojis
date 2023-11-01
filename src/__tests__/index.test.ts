import emojis from '../emojis';
import {countryCodeToFlag, emojiToLetter, flagToCountryCode, letterToEmoji, getRandomEmoji} from '../index';

test('countryCodeToEmoji', () => {
  expect(countryCodeToFlag('US')).toBe('🇺🇸');
});

test('flagToCountryCode', () => {
  expect(flagToCountryCode('🇺🇸')).toBe('US');
});

test('letterToEmoji', () => {
  expect(letterToEmoji('A')).toBe('🇦');
});

test('letterToEmoji with input more than single character', () => {
  expect(() => {
    letterToEmoji('AS');
  }).toThrow('letterToEmoji: letter must be a single character');
});

test('letterToEmoji with input less than single character', () => {
  expect(() => {
    letterToEmoji('');
  }).toThrow('letterToEmoji: letter must be a single character');
});

test('emojiToLetter', () => {
  expect(emojiToLetter('🇦')).toBe('A');
});

test('should return a different emoji on subsequent calls', () => {
  const emoji1 = getRandomEmoji();
  const emoji2 = getRandomEmoji();
  expect(emoji1).not.toEqual(emoji2);
});
