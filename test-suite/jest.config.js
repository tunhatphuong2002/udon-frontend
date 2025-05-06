/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  // only permit run jest file at /src/test/--.test|spec.ts
  testMatch: ['<rootDir>/src/test/**/*.(test|spec).ts'],
  // Add global timeout here
  testTimeout: 15000,
  // Module name mapper for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@clients/(.*)$': '<rootDir>/src/clients/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@configs/(.*)$': '<rootDir>/src/configs/$1',
    '^@helpers/(.*)$': '<rootDir>/src/helpers/$1',
    '^@test/(.*)$': '<rootDir>/src/test/$1',
    '^@scripts/(.*)$': '<rootDir>/src/scripts/$1',
  },
};
