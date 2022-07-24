import {
  dogNameWords,
  ickyWords,
  swearWords,
  censoredSwearWords,
  colorWords,
} from './wordLists';
import {
  generateSpecialCharactersRules,
  SPECIAL_CHARACTER,
} from './characters';

const removeCensoredSwearWords = (s: string) =>
  censoredSwearWords.reduce((acc, w) => {
    const globalRegexOfWord = RegExp(w.replace(/\*/g, '\\*'), 'g');
    return acc.replace(globalRegexOfWord, '');
  }, s.toLowerCase());

const easyValidations: ValidationsGenerator = (seed) => {
  const minLength = 4 + (seed % 4);

  return [
    {
      id: 'minimumLength',
      fn: (s) => s.length >= minLength,
      msg: `Password must have at least ${minLength} characters.`,
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
      fn: (s) => SPECIAL_CHARACTER.test(removeCensoredSwearWords(s)),
      msg: (s) =>
        `Password must contain a special character${
          removeCensoredSwearWords(s).length !== s.length
            ? " — asterisks for censoring don't count"
            : ''
        }.`,
    },
  ];
};

const mediumValidations: ValidationsGenerator = () => [
  {
    id: 'repeatedCharacters',
    fn: (s) => !/(.)\1\1/.test(s),
    msg: 'Password must not contain three of the same character in a row.',
  },
  {
    id: 'color',
    fn: (s) => colorWords.some((word) => s.toLowerCase().includes(word)),
    msg: 'Password must contain a color.',
  },
  {
    id: 'dog',
    fn: (s) => dogNameWords.some((word) => s.toLowerCase().includes(word)),
    msg: 'Password must contain a common dog name.',
  },
  {
    id: 'swearWords',
    fn: (s) =>
      [...swearWords, ...censoredSwearWords].some((word) =>
        s.toLowerCase().includes(word),
      ),
    msg: 'Password must contain a swear word that is 4 letters.',
  },
];

const hardValidations: ValidationsGenerator = (seed) => {
  const maxLength = 15 + (seed % 6);
  const parity = seed % 2;
  const divisorA = 10 + (seed % 10);
  const divisorB = 20 + (seed % 10);

  const orderParity = seed % 6 > 2;
  const numberComparer = (a: number, b: number): boolean =>
    orderParity ? a >= b : a <= b;
  const orderName = orderParity ? 'ascending' : 'descending';

  return [
    {
      id: 'lengthParity',
      fn: (s) => s.length % 2 === parity,
      msg: `Password must have an ${
        parity ? 'odd' : 'even'
      } number of characters.`,
    },
    {
      id: 'noIcky',
      fn: (s) => !ickyWords.some((word) => s.includes(word)),
      msg: 'Password must not contain any icky words.',
    },
    {
      id: 'maxLength',
      fn: (s) => s.length <= maxLength,
      msg: `Password must have at most ${maxLength} characters.`,
    },
    {
      id: 'includeMultipleOfDivisorA',
      fn: (s) =>
        s
          .split(/(\d+)/)
          .filter((w) => /\d/.test(w))
          .map((w) => parseInt(w, 10))
          .some((num) => num % divisorA === 0),
      msg: `Password must include a number that is divisible by ${divisorA}.`,
    },
    {
      id: 'digitsSumToDivisorB',
      fn: (s) => {
        const digitSum = s
          .split(/(\d)/)
          .filter((w) => /\d/.test(w))
          .map((w) => parseInt(w, 10))
          .reduce((acc, n) => acc + n, 0);
        return digitSum % divisorB === 0;
      },
      msg: `All the individual digits in the password must add up to a multiple of ${divisorB}.`,
    },
    {
      id: 'atMost3OfAnyCharacter',
      fn: (s) =>
        !Object.values(
          s.split('').reduce((acc, char) => {
            acc[char] = acc[char] || 0 + 1;
            return acc;
          }, {} as Record<string, number>),
        ).some((count) => count > 3),
      msg: 'Password must not contain at most 3 of any character.',
    },
    {
      id: 'digitOrder',
      fn: (s) => {
        const a = s
          .split('')
          .filter((w) => /[0-9]/.test(w))
          .map((w) => parseInt(w, 10))
          .every((num, index, arr) => {
            const fallback = orderParity ? 0 : Infinity;
            return numberComparer(num, arr[index - 1] ?? fallback);
          });
        return a;
      },
      msg: `All digits in password must be in ${orderName} order.`,
    },
    {
      id: 'censoredSwearWords',
      fn: (s) => !swearWords.some((word) => s.toLowerCase().includes(word)),
      msg: 'Swear words in password must be censored (i.e. f**k).',
    },
  ];
};

const reallyHardValidations: ValidationsGenerator = (seed) => [
  ...generateSpecialCharactersRules(seed),
  {
    id: 'no*',
    // Handle censored swear word case:
    fn: (s) => !removeCensoredSwearWords(s).includes('*'),
    msg: (s) =>
      `Password must not contain an asterisk (*)${
        removeCensoredSwearWords(s).length !== s.length
          ? ', except for censored swear words'
          : ''
      }.`,
  },
];

const shuffle = <T>(orig: Array<T>) => {
  const arr = [...orig];

  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
};

export const generateValidations = (seed: number): Array<Validation> => {
  const EASY = easyValidations(seed);
  const MEDIUM = mediumValidations(seed);
  const HARD = hardValidations(seed);
  const REALLY_HARD = reallyHardValidations(seed);

  // Shuffle the validation list for the user, but keep it in order of easy -> hard.
  return [
    ...shuffle(EASY),
    ...shuffle(MEDIUM),
    ...shuffle(HARD),
    ...shuffle(REALLY_HARD),
  ];
};
