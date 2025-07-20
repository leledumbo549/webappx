export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.tsx'],
  moduleNameMapper: {
    '^@/server/(.*)$': '<rootDir>/server/$1',
    '^@/(.*)$': '<rootDir>/client/$1',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.tests.json',
      useESM: true,
    }],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
