import { isShortName } from '../utils';

describe('isShortName', () => {
  it('should return true if the name contains colons at the beginning and end', () => {
    const name = ':example:';
    const result = isShortName(name);
    expect(result).toBe(true);
  });

  it('should return false if the name does not contain colons at the beginning and end', () => {
    const name = 'example';
    const result = isShortName(name);
    expect(result).toBe(false);
  });

  it('should return false if the name contains a colon at the beginning but not at the end', () => {
    const name = ':example';
    const result = isShortName(name);
    expect(result).toBe(false);
  });

  it('should return false if the name contains a colon at the end but not at the beginning', () => {
    const name = 'example:';
    const result = isShortName(name);
    expect(result).toBe(false);
  });

  it('should return true if the name contains multiple colons at the beginning and end', () => {
    const name = ':::example:::';
    const result = isShortName(name);
    expect(result).toBe(true);
  });

  it('should return false if the name is an empty string', () => {
    const name = '';
    const result = isShortName(name);
    expect(result).toBe(false);
  });
});
