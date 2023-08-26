import { getTotalAndStripeFee, getStripeFee } from '../stripeFeeUtils';

describe('Utils > stripeFeeUtils.js', () => {
  describe('getStripeFee()', () => {
    it('should return 0 if no card (cash payment)', () => {
      // Setup
      const amount = 123;
      // Execute
      const result = getStripeFee(amount, 0, false);

      // Assert
      expect(result).toEqual(0);
    });

    it('should return 0 if charge is 0', () => {
      // Setup
      const amount = 0;
      // Execute
      const result = getStripeFee(amount);

      // Assert
      expect(result).toEqual(0);
    });

    it('should return valid fee if using card and charge > 0 ', () => {
      // Setup
      const amount = 321;
      // Execute
      const result = getStripeFee(amount, 5);

      // Assert
      expect(result).toEqual(10.045314109165815);
    });

    it('should return 0 if charge is negative', () => {
      // Setup
      const amount = -321;
      // Execute
      const result = getStripeFee(amount);

      // Assert
      expect(result).toEqual(0);
    });
    it('should not fail if bad amount is passed to getStripeFee ', () => {
      // Setup
      const amount = NaN;
      // Execute
      const result = getStripeFee(amount);

      // Assert
      expect(result).toEqual(0);
    });
  });

  describe('getTotalAndStripeFee()', () => {
    it('should return the total and a stripeFee of 0 if not using credit card ', () => {
      // Setup
      const amount = 999;
      const platformFee = 5;

      // Execute
      const result = getTotalAndStripeFee(amount, platformFee, false);

      // Assert
      expect(result[0]).toEqual(1004);
      expect(result[1]).toEqual(0);
    });

    it('should return the total and a stripeFee included if using credit card ', () => {
      // Setup
      const amount = 999;
      const platformFee = 5;

      // Execute
      const result = getTotalAndStripeFee(amount, platformFee, true);

      // Assert
      expect(result[0]).toEqual(1034.2945417095777);
      expect(result[1]).toEqual(30.294541709577743);
    });

    it('should not fail if bad transaction amount sent', () => {
      // Setup
      const amount = null;
      const platformFee = 5;

      // Execute
      const result = getTotalAndStripeFee(amount, platformFee, true);

      // Assert
      expect(result[0]).toEqual(5.458290422245108);
      expect(result[1]).toEqual(0.4582904222451081);
    });

    it('should not fail if bad platformFee sent ', () => {
      // Setup
      const amount = 999;
      const platformFee = NaN;

      // Execute
      const result = getTotalAndStripeFee(amount, platformFee, true);

      // Assert
      expect(result[0]).toEqual(1029.145211122554);
      expect(result[1]).toEqual(30.145211122553974);
    });

    it('should not accidentally show a refund if negative platformFee is sent with a credit card ', () => {
      // Setup
      const amount = 123;
      const platformFee = -5;

      // Execute
      const result = getTotalAndStripeFee(amount, platformFee, true);

      // Assert
      expect(result[0]).toEqual(126.98249227600412);
      expect(result[1]).toEqual(3.9824922760041233);
    });

    it('should not accidentally show a refund if negative platformFee is sent with cash', () => {
      // Setup
      const amount = 123;
      const platformFee = -5;

      // Execute
      const result = getTotalAndStripeFee(amount, platformFee, false);

      // Assert
      expect(result[0]).toEqual(123.0);
      expect(result[1]).toEqual(0);
    });
  });
});
