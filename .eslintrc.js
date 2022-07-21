module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'airbnb-typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',

    'no-console': 'off',

    'react/react-in-jsx-scope': 'off',

    'import/prefer-default-export': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-one-expression-per-line': 'off',
  },
};
