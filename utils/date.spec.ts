import { type as osType } from 'os';
import {
  parseDate,
  formatDate,
  isDateValid,
  convertFormat,
  stringDateToObject,
  objectDateToString,
  normaliseDateToISO,
} from './date';

describe('date util', () => {
  describe('parseDate', () => {
    it('should work properly', () => {
      expect(parseDate('22/09/1941')).toEqual(new Date(1941, 8, 22));
      expect(parseDate('22/01/2021 10:46:42')).toEqual(new Date(2021, 0, 22));
      expect(parseDate('2000-12-12')).toEqual(new Date(2000, 11, 12));
      expect(parseDate('2021-01-19T16:28:54.1295896Z')).toEqual(
        new Date(2021, 0, 19)
      );
      expect(parseDate('-12-12')).toEqual(undefined);
    });
  });

  xdescribe('formatDate', () => {
    it('should work properly', () => {
      // Allow for MacOS short month output differences from other platforms.
      const expectedMonth = osType() === 'Darwin' ? 'Sept' : 'Sep';

      expect(formatDate('22/09/1941')).toEqual(`22 ${expectedMonth} 1941`);
      expect(formatDate('22/09/1941 13:49:43')).toEqual(
        `22 ${expectedMonth} 1941`
      );
    });
  });

  describe('isDateValid', () => {
    it('should work properly', () => {
      expect(isDateValid('22/09/1941')).toBe(true);
      expect(isDateValid('22/19/1941')).toBe(false);
      expect(isDateValid('2020-21-21')).toBe(false);
      expect(isDateValid('2020-11-21')).toBe(true);
      expect(isDateValid('foo')).toBe(false);
      expect(isDateValid('-12-12')).toBe(false);
    });
  });

  describe('convertFormat', () => {
    it('should work properly', () => {
      expect(convertFormat('2000-12-01')).toBe('01-12-2000');
    });
  });

  describe('stringDateToObject', () => {
    it('should work properly', () => {
      expect(stringDateToObject('2000-12-01')).toEqual({
        day: '01',
        month: '12',
        year: '2000',
      });
      expect(stringDateToObject('2000-12-01T00:00:00.0000000')).toEqual({
        day: '01',
        month: '12',
        year: '2000',
      });
      expect(stringDateToObject('2000-12-01 00:00:00')).toEqual({
        day: '01',
        month: '12',
        year: '2000',
      });
      expect(stringDateToObject('01-12-2000', 'EU')).toEqual({
        day: '01',
        month: '12',
        year: '2000',
      });
    });
  });

  describe('objectDateToString', () => {
    it('should work properly', () => {
      expect(
        objectDateToString({
          day: '01',
          month: '12',
          year: '2000',
        })
      ).toEqual('2000-12-01');
      expect(
        objectDateToString(
          {
            day: '01',
            month: '12',
            year: '2000',
          },
          'EU'
        )
      ).toEqual('01-12-2000');
      expect(
        objectDateToString({
          day: '',
          month: '',
          year: '',
        })
      ).toEqual(null);
    });
  });

  describe('normaliseDateToISO', () => {
    it('should handle all likely date formats', () => {
      expect(normaliseDateToISO('1941-09-22')).toEqual('1941-09-22');
      expect(normaliseDateToISO('22/09/1941')).toEqual('1941-09-22');
      expect(normaliseDateToISO('22/09/1941 13:49:43')).toEqual(
        '1941-09-22T13:49:43'
      );
      expect(normaliseDateToISO('22/09/1941 3:49:43')).toEqual(
        '1941-09-22T03:49:43'
      );
    });
  });
});
