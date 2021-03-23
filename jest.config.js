module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/src/infrastructure/",
    "/src/adapters/controllers/base/",
    "/src/adapters/providers/base/",
    "/src/adapters/repositories/base/",
    "/src/application/mocks/",
    "/src/application/shared/",
  ],
  modulePathIgnorePatterns: [
    "/src/infrastructure/",
    "/src/adapters/controllers/base/",
    "/src/adapters/providers/base",
    "/src/adapters/repositories/base/",
    "/src/application/mocks/",
    "/src/application/shared/",
    "/src/index.ts",
  ],
};
