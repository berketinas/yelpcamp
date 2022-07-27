module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    // my custom configurations
    'indent': ['error', 4],
    'object-curly-newline': ['error',
        {
        'ObjectPattern': { 'multiline': true },
        }
    ],
    'no-console': ['error', { 'allow': ['log', 'error'] }],
    'no-plusplus': 'off',
    'max-len': ['error', { 'code': 140 }],
    'quotes': ['error', 'single'],
    'linebreak-style': ['error', 'windows'],
    'no-multi-spaces': ['error', { 'ignoreEOLComments': true }],
    'no-await-in-loop': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
  },
};
