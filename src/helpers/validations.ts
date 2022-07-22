const SPECIAL_CHARACTER = /[!@#$%^&*()[\]{},.<>/?;:'"]/;

const validations: Array<Validation> = [
  {
    id: 'longEnough',
    fn: (s) => s.length >= 8,
    msg: 'Password must be at least 8 characters.',
  },
  {
    id: 'shortEnough',
    fn: (s) => s.length < 64,
    msg: 'Password must less than 64 characters.',
  },
  {
    id: 'mustBeOddLength',
    fn: (s) => s.length % 2 !== 0,
    msg: 'Password must have an odd number of characters.',
  },
  {
    id: 'mustContainASpecialCharacter',
    fn: (s) => SPECIAL_CHARACTER.test(s),
    msg: 'Password must contain a special character.',
  },
];

export default validations;
