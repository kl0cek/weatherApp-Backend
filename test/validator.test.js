import { isValid } from '../app/forecast/utils/validators';

describe('Validators', () => {
  describe('isValid', () => {
    test('should return true for valid coordinates', () => {
      expect(isValid('52.2297', '21.0122')).toBe(true); 
      expect(isValid('0', '0')).toBe(true); 
      expect(isValid('-90', '-180')).toBe(true); 
      expect(isValid('90', '180')).toBe(true); 
    });

    test('should return true for valid numeric coordinates', () => {
      expect(isValid(52.2297, 21.0122)).toBe(true);
      expect(isValid(0, 0)).toBe(true);
    });

    test('should return false for invalid latitude', () => {
      expect(isValid('91', '0')).toBe(false); 
      expect(isValid('-91', '0')).toBe(false); 
    });

    test('should return false for non-numeric values', () => {
      expect(isValid('abc', '123')).toBe(false);
      expect(isValid('123', 'xyz')).toBe(false);
      expect(isValid('', '')).toBe(false);
      expect(isValid(null, null)).toBe(false);
      expect(isValid(undefined, undefined)).toBe(false);
    });

    test('should return false for missing parameters', () => {
      expect(isValid()).toBe(false);
      expect(isValid('52.2297')).toBe(false);
    });
  });
});