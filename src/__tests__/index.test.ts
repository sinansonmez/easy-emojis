import {countryCodeToFlag, emojiToLetter, flagToCountryCode, letterToEmoji} from '../index';

test('countryCodeToEmoji', () => {
  expect(countryCodeToFlag('US')).toBe('πΊπΈ');
});

test('flagToCountryCode', () => {
  expect(flagToCountryCode('πΊπΈ')).toBe('US');
});

test('letterToEmoji', () => {
  expect(letterToEmoji('A')).toBe('π¦');
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
  expect(emojiToLetter('π¦')).toBe('A');
});
