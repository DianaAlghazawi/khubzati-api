require('dotenv').config();
module.exports = {
  env: {
    browser: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js'],
        paths: ['src'],
      },
    },
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: ['airbnb-base', 'prettier', 'plugin:yml/standard'],
  plugins: ['import', 'prettier', '@ts-safeql/eslint-plugin'],
  root: true,
  ignorePatterns: ['src/seeders/*.js', 'src/migrations/*.js'],
  rules: {
    'prettier/prettier': 'error',
    'max-len': ['error', { code: 120 }],
    'class-methods-use-this': 0,
    'import/no-absolute-path': 2,
    'import/no-extraneous-dependencies': 1,
    'import/no-named-as-default': 1,
    'eol-last': 2,
    'no-multiple-empty-lines': 2,
    'no-param-reassign': 0,
    'no-throw-literal': 0,
    'no-trailing-spaces': 2,
    'no-unused-vars': ['error', { argsIgnorePattern: 'req|res|next' }],
    'no-unused-expressions': [2, { allowTaggedTemplates: true }],
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'yml/quotes': ['error', { prefer: 'single' }],
    '@ts-safeql/check-sql': [
      'error',
      {
        connections: [
          {
            connectionUrl: process.env.DATABASE_URL,
            // The migrations path:
            migrationsDir: './prisma/migrations',
            targets: [
              // This makes `prisma.$queryRaw` and `prisma.$executeRaw` commands linted
              { tag: 'prisma.+($queryRaw|$executeRaw)', transform: '{type}[]' },
            ],
          },
        ],
      },
    ],
  },
};
