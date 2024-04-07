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
    'func-names': ['off'],
    'import/no-extraneous-dependencies': ['off'],
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-use-before-define': ['off'],
    'object-curly-newline': ['off'],
    'react/jsx-filename-extension': ['off'],
    'react/react-in-jsx-scope': ['off'],
    'react/style-prop-object': ['off'],
  },
};
