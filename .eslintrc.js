module.exports = {
  // parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  settings: {
    'import/parsers': {
      "@typescript-eslint/parser": [".ts", ".tsx", '.d.ts']
    },
    'import/extensions': [ '.js', '.jsx', '.ts', '.tsx', '.d.ts'],
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      }
    }
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript/base',
  ],
  env: {
    node: true,
    es6: true,
  },
  rules: {
    'import/prefer-default-export': 0,
    'lines-between-class-members': ['error', 'always',  {exceptAfterSingleLine: true}],
    'consistent-return': 0,
    'import/no-unused-modules': [2, {'unusedExports': true}],
    'no-return-assign': [2, 'except-parens'],
    'object-curly-newline': ['error', {
      ImportDeclaration: 'never',
    }],
    'no-underscore-dangle': 0,
    'max-len': 0,
    'implicit-arrow-linebreak': 0,
    'no-plusplus': 0,
    // Typescript
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/no-unused-vars': 1,
  }
};
