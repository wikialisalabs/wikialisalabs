import type { Config } from 'jest';

const config: Config = {
  preset:          'ts-jest',
  testEnvironment: 'jsdom',
  // Runs after the jest test framework is installed in each test file
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // CSS modules → identity object proxy (className access returns the key name)
    '\\.module\\.css$': '<rootDir>/jest.cssModuleStub.js',
    '\\.css$':          '<rootDir>/jest.cssModuleStub.js',
    // Path alias
    '^@/(.*)$':         '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
  testMatch: [
    '<rootDir>/src/**/*.test.(ts|tsx)',
  ],
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    'src/hooks/**/*.{ts,tsx}',
    'src/types/**/*.{ts,tsx}',
    'src/providers/**/*.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageThresholds: {
    // Global threshold — Phase 3 target ≥80%
    global: {
      branches:   70,
      functions:  75,
      lines:      80,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
  clearMocks:   true,
  restoreMocks: true,
};

export default config;
