import { dogNameWords, ickyWords, colorWords } from './constants';

const SPECIAL_CHARACTER = /[!@#$%^&*()[\]{},.<>/?;:'"]/;

const easyValidations: Array<Validation> = [
  {
    id: 'moreThan8',
    fn: (s) => s.length > 8,
    msg: 'Password must have more than 8 characters.',
  },
  {
    id: 'number',
    fn: (s) => /[0-9]/.test(s),
    msg: 'Password must contain a number.',
  },
  {
    id: 'uppercaseLetter',
    fn: (s) => /[A-Z]/.test(s),
    msg: 'Password must contain an uppercase letter.',
  },
  {
    id: 'lowercaseLetter',
    fn: (s) => /[a-z]/.test(s),
    msg: 'Password must contain a lowercase letter.',
  },
  {
    id: 'specialCharacter',
    fn: (s) => SPECIAL_CHARACTER.test(s),
    msg: 'Password must contain a special character.',
  },
  {
    id: 'noPassword',
    fn: (s) => s !== 'password',
    msg: 'Password must not be "password".',
  },
  {
    id: 'no123456',
    fn: (s) => s !== '123456',
    msg: 'Password must not be "123456".',
  },
  {
    id: 'no123123123',
    fn: (s) => s !== '123123123',
    msg: 'Password must be "123123123".',
  },
];
const mediumValidations: Array<Validation> = [
  {
    id: 'repeatedCharacters',
    fn: (s) => !/(.)\1\1/.test(s),
    msg: 'Password must not contain three of the same character in a row.',
  },
  {
    id: 'color',
    fn: (s) => colorWords.some((word) => s.includes(word)),
    msg: 'Password must contain a color.',
  },
  {
    id: 'dog',
    fn: (s) => dogNameWords.some((word) => s.includes(word)),
    msg: 'Password must contain a dog name.',
  },
];

const hardValidations: Array<Validation> = [
  {
    id: 'oddLength',
    fn: (s) => s.length % 2 !== 0,
    msg: 'Password must have an odd number of characters.',
  },
  {
    id: 'noIcky',
    fn: (s) => !ickyWords.some((word) => s.includes(word)),
    msg: 'Password must not contain any icky words.',
  },
  {
    id: 'lessThan64',
    fn: (s) => s.length < 64,
    msg: 'Password must have less than 64 characters.',
  },
  {
    id: 'multipleOf17',
    fn: (s) =>
      s
        .split(/(\d+)/)
        .filter((w) => /\d/.test(w))
        .map((w) => parseInt(w, 10))
        .some((num) => num % 17 === 0),
    msg: 'Password must include a number that is divisible by 17.',
  },
  {
    id: 'digitsSumToMultipleOf31',
    fn: (s) => {
      const digitSum = s
        .split(/(\d)/)
        .filter((w) => /\d/.test(w))
        .map((w) => parseInt(w, 10))
        .reduce((acc, n) => acc + n, 0);
      return digitSum % 31 === 0;
    },
    msg: 'All the digits in the password must add up to a multiple of 31.',
  },
  {
    id: 'no!',
    fn: (s) => !s.includes('!'),
    msg: 'Password must not contain an exclamation point (!).',
  },
  {
    id: 'no@',
    fn: (s) => !s.includes('@'),
    msg: 'Password must not contain an at sign (@).',
  },
  {
    id: 'no#',
    fn: (s) => !s.includes('#'),
    msg: 'Password must not contain a pound sign (#).',
  },
  {
    id: 'no$',
    fn: (s) => !s.includes('$'),
    msg: 'Password must not contain a dollar sign ($).',
  },
  {
    id: 'no%',
    fn: (s) => !s.includes('%'),
    msg: 'Password must not contain a percent sign (%).',
  },
  {
    id: 'no^',
    fn: (s) => !s.includes('^'),
    msg: 'Password must not contain a caret (^).',
  },
  {
    id: 'no&',
    fn: (s) => !s.includes('&'),
    msg: 'Password must not contain an ampersand (&).',
  },
  {
    id: 'no*',
    fn: (s) => !s.includes('*'),
    msg: 'Password must not contain an asterisk (*).',
  },
  {
    id: 'no(',
    fn: (s) => !s.includes('('),
    msg: 'Password must not contain a left parenthesis (().',
  },
  {
    id: 'no-',
    fn: (s) => !s.includes('-'),
    msg: 'Password must not contain a hyphen (-).',
  },
  {
    id: 'no_',
    fn: (s) => !s.includes('_'),
    msg: 'Password must not contain an underscore (_).',
  },
  {
    id: 'no+',
    fn: (s) => !s.includes('+'),
    msg: 'Password must not contain a plus sign (+).',
  },
  {
    id: 'no=',
    fn: (s) => !s.includes('='),
    msg: 'Password must not contain an equals sign  (=).',
  },
  {
    id: 'no:',
    fn: (s) => !s.includes(':'),
    msg: 'Password must not contain a colon (:).',
  },
  {
    id: 'no;',
    fn: (s) => !s.includes(';'),
    msg: 'Password must not contain a semicolon (;).',
  },
  {
    id: 'noSingleQuote',
    fn: (s) => !s.includes("'"),
    msg: "Password must not contain a single quote (').",
  },
  {
    id: 'no"',
    fn: (s) => !s.includes('"'),
    msg: 'Password must not contain a double quote (").',
  },
  {
    id: 'no,',
    fn: (s) => !s.includes(','),
    msg: 'Password must not contain a comma (,).',
  },
  {
    id: 'no.',
    fn: (s) => !s.includes('.'),
    msg: 'Password must not contain a period (.).',
  },
  {
    id: 'no<',
    fn: (s) => !s.includes('<'),
    msg: 'Password must not contain a less-than sign (<).',
  },
  {
    id: 'no>',
    fn: (s) => !s.includes('>'),
    msg: 'Password must not contain a greater-than sign (>).',
  },
  {
    id: 'no/',
    fn: (s) => !s.includes('/'),
    msg: 'Password must not contain a forward slash (/).',
  },
  {
    id: 'noBackSlash',
    fn: (s) => !s.includes('\\'),
    msg: 'Password must not contain a backslash ().',
  },
  {
    id: 'no|',
    fn: (s) => !s.includes('|'),
    msg: 'Password must not contain a vertical bar (|).',
  },
  {
    id: 'no?',
    fn: (s) => !s.includes('?'),
    msg: 'Password must not contain a question mark (?).',
  },
  {
    id: 'noMoreThan3ofAnyCharacter',
    fn: (s) =>
      !Object.values(
        s.split('').reduce((acc, char) => {
          acc[char] = acc[char] || 0 + 1;
          return acc;
        }, {} as Record<string, number>),
      ).some((count) => count > 3),
    msg: 'Password must not contain a question mark (?).',
  },
];

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

const validations: Record<Difficulty, Array<Validation>> = {
  EASY: easyValidations,
  MEDIUM: mediumValidations,
  HARD: hardValidations,
};

export default validations;
