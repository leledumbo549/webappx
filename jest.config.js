export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.tsx'],
  moduleNameMapper: {
    '^@/server/(.*)$': '<rootDir>/server/$1',
    '^@/(.*)$': '<rootDir>/client/$1',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.tests.json',
    },
  },
};
