export const specialCharacterInfo = [
  { char: '`', name: 'back tick' },
  { char: '~', name: 'tilde' },
  { char: '!', name: 'exclamation point' },
  { char: '@', name: 'at sign' },
  { char: '#', name: 'pound sign' },
  { char: '$', name: 'dollar sign' },
  { char: '%', name: 'percent sign' },
  { char: '^', name: 'caret' },
  { char: '&', name: 'ampersand' },
  { char: '*', name: 'asterisk' },
  { char: '(', name: 'left parenthesis' },
  { char: ')', name: 'right parenthesis' },
  { char: '[', name: 'left bracket' },
  { char: ']', name: 'right bracket' },
  { char: '{', name: 'left curly bracket' },
  { char: '}', name: 'right curly bracket' },
  { char: '-', name: 'hyphen' },
  { char: '_', name: 'underscore' },
  { char: '+', name: 'plus sign' },
  { char: '=', name: 'equals sign' },
  { char: ':', name: 'colon' },
  { char: ';', name: 'semicolon' },
  { char: "'", name: 'single quote' },
  { char: '"', name: 'double quote' },
  { char: ',', name: 'comma' },
  { char: '.', name: 'period' },
  { char: '<', name: 'less than' },
  { char: '>', name: 'greater than' },
  { char: '/', name: 'forward slash' },
  { char: '\\', name: 'backslash' },
  { char: '|', name: 'vertical bar' },
  { char: '?', name: 'question mark' },
];

const allSpecialCharacters = specialCharacterInfo
  .map(({ char }) => char)
  .join('');

export const SPECIAL_CHARACTER = new RegExp(
  `[${allSpecialCharacters.replace(/([\]\\-])/g, '\\$1')}]`,
);
