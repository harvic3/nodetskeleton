const { writeFileSync, mkdirSync } = require("fs");
const { replaceAll } = require("../stringUtils");
const { templates } = require("../templates");
const { join } = require("path");

function ensureUseCase(useCasePath, testUseCasePath, useCaseName) {
  const useCaseTemplate = replaceAll(templates.useCaseTemplate, {
    "{{UseCaseName}}": useCaseName,
  });

  const testUseCaseTemplate = replaceAll(templates.testUseCaseTemplate, {
    "{{UseCaseName}}": useCaseName,
  });

  mkdirSync(join(useCasePath, ".."), { recursive: true });

  writeFileSync(useCasePath, useCaseTemplate);
  writeFileSync(testUseCasePath, testUseCaseTemplate);
}

module.exports = {
  ensureUseCase,
};
