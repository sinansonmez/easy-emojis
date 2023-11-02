import { countryCodeToFlag, emojiToLetter, flagToCountryCode, letterToEmoji, getRandomEmoji, getEmojiByShortName, getEmojiByName } from '../index';

describe('index', () => {
  beforeAll(() => {
    // Mock console.error and console.warn to prevent actual logging during tests
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  it('countryCodeToEmoji', () => {
    expect(countryCodeToFlag('US')).toBe('🇺🇸');
  });

  it('flagToCountryCode', () => {
    expect(flagToCountryCode('🇺🇸')).toBe('US');
  });

  it('letterToEmoji', () => {
    expect(letterToEmoji('A')).toBe('🇦');
  });

  it('letterToEmoji with input more than single character', () => {
    expect(() => {
      letterToEmoji('AS');
    }).toThrow('letterToEmoji: letter must be a single character');
  });

  it('letterToEmoji with input less than single character', () => {
    expect(() => {
      letterToEmoji('');
    }).toThrow('letterToEmoji: letter must be a single character');
  });

  it('emojiToLetter', () => {
    expect(emojiToLetter('🇦')).toBe('A');
  });

  it('should return a different emoji on subsequent calls', () => {
    const emoji1 = getRandomEmoji();
    const emoji2 = getRandomEmoji();
    expect(emoji1).not.toEqual(emoji2);
  });

  it('should return the correct emoji for a valid short name', () => {
    const emojiShortName = ':apple:';
    const result = getEmojiByShortName(emojiShortName);
    expect(result).toBe('🍎');
  });

  it('should return an empty string and log an error for an invalid short name', () => {
    const invalidShortName = 'invalid-emoji';
    const result = getEmojiByShortName(invalidShortName);
    expect(result).toBe('');
    expect(console.error).toHaveBeenCalledWith(
      'you didnt pass a short name. Please pass correct short name like :apple: or use getEmojiByName'
    );
  });

  it('should return an empty string and log a warning for a short name that is not found', () => {
    const nonExistentShortName = ':grape:';
    const result = getEmojiByShortName(nonExistentShortName);
    expect(result).toBe('');
    expect(console.warn).toHaveBeenCalledWith(
      'emoji not found with name: ', nonExistentShortName
    );
  });

  it('should return the correct emoji for a valid emoji name', () => {
    const emojiName = 'RED Apple';
    const result = getEmojiByName(emojiName);
    expect(result).toBe('🍎');
  });

  it('should return an empty string and log a warning for an invalid emoji name', () => {
    const invalidEmojiName = 'Grape';
    const result = getEmojiByName(invalidEmojiName);
    expect(result).toBe('');
    expect(console.warn).toHaveBeenCalledWith(
      "emoji not found with name: ", invalidEmojiName
    );
  });

  it('should return an empty string and log a warning for a null emoji name', () => {
    const nullEmojiName = null;
    const result = getEmojiByName(nullEmojiName as unknown as string);
    expect(result).toBe('');
    expect(console.warn).toHaveBeenCalledWith(
      "emoji not found with name: ", nullEmojiName
    );
  });

  it('should return an empty string and log a warning for an undefined emoji name', () => {
    const undefinedEmojiName = undefined;
    const result = getEmojiByName(undefinedEmojiName as unknown as string);
    expect(result).toBe('');
    expect(console.warn).toHaveBeenCalledWith(
      "emoji not found with name: ", undefinedEmojiName
    );
  })
})
