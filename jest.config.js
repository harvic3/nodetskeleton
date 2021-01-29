module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/src/infrastructure/",
    "/src/adapters/controllers/base/",
    "/src/application/mocks/",
    "/src/application/shared/",
    "/dtos/",
  ],
  modulePathIgnorePatterns: [
    "/src/infrastructure/",
    "/src/adapters/controllers/base/",
    "/src/application/mocks/",
    "/src/application/shared/",
    "/src/index.ts",
  ],
};
