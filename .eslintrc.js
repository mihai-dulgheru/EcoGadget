module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'comma-dangle': ['off'],
    'func-names': ['off'],
    'function-paren-newline': ['off'],
    'global-require': ['off'],
    'implicit-arrow-linebreak': ['off'],
    'import/no-extraneous-dependencies': ['off'],
    'import/prefer-default-export': ['off'],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'no-use-before-define': ['off'],
    'object-curly-newline': ['off'],
    'operator-linebreak': ['off'],
    'react/jsx-curly-newline': ['off'],
    'react/jsx-filename-extension': ['off'],
    'react/jsx-props-no-spreading': ['error', { custom: 'ignore' }],
    'react/prop-types': ['off'],
    'react/react-in-jsx-scope': ['off'],
    'react/style-prop-object': ['off'],
  },
};
