module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "coverage",
  modulePathIgnorePatterns: [
    "/src/infrastructure/",
    "/src/application/mocks/",
    "/src/application/shared/",
  ],
};
