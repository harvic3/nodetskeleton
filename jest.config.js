module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/src/infrastructure/",
    "/src/application/mocks/",
    "/dtos/",
  ],
  modulePathIgnorePatterns: [
    "/src/infrastructure/",
    "/src/application/mocks/",
    "/src/application/shared/",
  ],
};
