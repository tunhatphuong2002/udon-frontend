/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}],
  },
  // only permit run jest file at /src/test/--.test|spec.ts
  testMatch: ['<rootDir>/src/test/**/*.(test|spec).ts'],
  // Add global timeout here
  testTimeout: 15000,
};
