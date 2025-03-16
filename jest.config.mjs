// Jest configuration for Next.js 15+
/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  moduleNameMapper: {
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/src/$1',
    // Handle CSS imports (with CSS modules)
    '\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    // Handle CSS imports (without CSS modules)
    '\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    // Handle image imports
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx',
  ],
  // Transform for ESM modules
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.test.js' }],
  },
};

export default config;
