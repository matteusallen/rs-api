const { upperFirst, startCase } = require('../stringHelpers');

const capitolCaseAlphaRE = /^[A-Z][a-z]*/;
const lowerCaseAlphaRE = /^[a-z]/;
const capitolCaseAlphaTrimmedRE = /^[A-Z][a-z]*$/;
const globalTitleCaseWordRE = /([A-Z][a-z]*)|(\d+)/g;
const globalLowerCaseWordRE = /^[a-z]+/g;
const globalMultipleSpaceRE = /\s{2,}/g;

describe('Utils > stringHelpers.js', () => {
  describe('upperFirst()', () => {
    it('should format words starting with a lower case letter', () => {
      const words = ['zero', 'one', 'two', 'three'];

      words.forEach(word => {
        expect(upperFirst(word)).toMatch(capitolCaseAlphaRE);
        expect(upperFirst(word)).not.toMatch(lowerCaseAlphaRE);
      });
    });

    it('should keep first character capitol for correct case words', () => {
      const words = ['Zero', 'One', 'Two', 'Three'];

      words.forEach(word => {
        expect(upperFirst(word)).toMatch(capitolCaseAlphaRE);
        expect(upperFirst(word)).not.toMatch(lowerCaseAlphaRE);
      });
    });

    it('should ignore non-alphabetic first characters', () => {
      const words = ['0zero', ' one', '?two', '*three'];

      words.forEach(word => {
        expect(upperFirst(word)).not.toMatch(lowerCaseAlphaRE);
      });
    });

    it('should trim inputs before processing', () => {
      const words = ['  zero ', ' one ', ' two ', '  three '];

      words.forEach(word => {
        expect(upperFirst(word)).toMatch(capitolCaseAlphaTrimmedRE);
      });
    });
  });

  describe('startCase()', () => {
    it('should make each word starting with lower case capitol', () => {
      const sentences = ['what is this doing here', 'i dont know', 'well, you probably should since you wrote it', 'yeah, I guess so'];

      sentences.forEach(sentence => {
        const formatted = startCase(sentence);
        expect(formatted).toMatch(globalTitleCaseWordRE);
        expect(formatted).not.toMatch(globalLowerCaseWordRE);
      });
    });

    it('should strip out non-alphabetic characters and space separate camelCase', () => {
      const sentences = [
        'what is this 1doing here?',
        "i don't know...",
        'well, you probably should since you are the only possible person who could have invited him!',
        '...bro, can you even type?',
        "check yo'self little 1b4u wreck yo'self",
        'what is thisThat hereThereEverywhere'
      ];

      sentences.forEach(sentence => {
        const formatted = startCase(sentence);
        expect(formatted).toMatch(globalTitleCaseWordRE);
        expect(formatted).not.toMatch(globalLowerCaseWordRE);
      });
    });

    it('should separate words by only one space', () => {
      const sentences = [
        'what      are       you       trying      to say',
        "i      don't      know...",
        'well,        you probably should since       you are the one typing!!!'
      ];

      sentences.forEach(sentence => {
        const formatted = startCase(sentence);
        expect(formatted).toMatch(globalTitleCaseWordRE);
        expect(formatted).not.toMatch(globalLowerCaseWordRE);
        expect(formatted).not.toMatch(globalMultipleSpaceRE);
      });
    });
  });
});
