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
    'global-require': ['off'],
    'import/no-extraneous-dependencies': ['off'],
    'import/prefer-default-export': ['off'],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-use-before-define': ['off'],
    'object-curly-newline': ['off'],
    'operator-linebreak': ['error', 'after'],
    'react/jsx-filename-extension': ['off'],
    'react/prop-types': ['off'],
    'react/react-in-jsx-scope': ['off'],
    'react/style-prop-object': ['off'],
  },
};
