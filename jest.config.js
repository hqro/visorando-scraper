module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
  testPathIgnorePatterns: [
    '/(dist|node_modules|pkg)/',
  ],
  testEnvironment: 'node',
};
