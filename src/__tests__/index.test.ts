import { countryCodeToFlag, flagToCountryCode, letterToEmoji } from '../index';

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
  expect(letterToEmoji('🇦')).toBe('A');
});

test('emojiToLetter with input more than single character', () => {
  expect(() => {
    letterToEmoji('🇦🇦');
  }).toThrow('emojiToLetter: emoji must be a single character');
});

test('emojiToLetter with input less than single character', () => {
  expect(() => {
    letterToEmoji('');
  }).toThrow('emojiToLetter: emoji must be a single character');
});
