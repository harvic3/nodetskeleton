const { writeFileSync, mkdirSync, readFileSync } = require("fs");
const { replaceAll } = require("../stringUtils");
const { templates } = require("../templates");
const { join } = require("path");
const {
  addLinesAfterPosition,
  addLinesBeforePosition,
  getLinePositionByContent,
  replaceContentLineInPosition,
} = require("../fileUtils");

function ensureExistingController(
  settingsFile,
  controllerPath,
  useCaseName,
  useCaseNameCamel,
  endPoint,
  httpMethod,
) {
  const httpMethodLower = httpMethod.toLowerCase();
  let controllerContent = readFileSync(controllerPath, "utf8");
  const importLineNumber = getLinePositionByContent(
    controllerContent,
    settingsFile.controllerImportLineToFind,
  );
  const importControllerContent = replaceAll(templates.importControllerTemplate, {
    "{{UseCaseName}}": useCaseName,
  });
  controllerContent = replaceContentLineInPosition(
    controllerContent,
    importLineNumber,
    settingsFile.controllerImportLineToFind,
    importControllerContent,
  );
  const functionContextLineNumber = getLinePositionByContent(
    controllerContent,
    settingsFile.controllerFunctionLineToFind,
  );
  const functionContextTemplate = replaceAll(templates.functionControllerTemplate, {
    "{{UseCaseNameCamel}}": useCaseNameCamel,
    "{{UseCaseName}}": useCaseName,
  });
  controllerContent = addLinesBeforePosition(
    controllerContent,
    functionContextLineNumber,
    functionContextTemplate,
  );
  const routerLineNumber = getLinePositionByContent(
    controllerContent,
    settingsFile.controllerRouterLineToFind,
  );
  const routerContextTemplate = replaceAll(templates.routeControllerTemplate, {
    "{{HttpMethodLower}}": httpMethodLower,
    "{{HttpMethodUpper}}": httpMethod,
    "{{EndPoint}}": endPoint,
    "{{UseCaseNameCamel}}": useCaseNameCamel,
  });
  controllerContent = addLinesAfterPosition(
    controllerContent,
    routerLineNumber,
    routerContextTemplate,
  );

  writeFileSync(controllerPath, controllerContent);
}

function ensureNewController(
  controllerPath,
  useCaseName,
  useCaseNameCamel,
  apiName,
  apiNameCapitalized,
  endPoint,
  httpMethod,
) {
  const httpMethodLower = httpMethod.toLowerCase();
  const controllerTemplate = replaceAll(templates.controllerTemplate, {
    "{{UseCaseName}}": useCaseName,
    "{{UseCaseNameCamel}}": useCaseNameCamel,
    "{{EndPoint}}": endPoint,
    "{{HttpMethodLower}}": httpMethodLower,
    "{{HttpMethodUpper}}": httpMethod,
    "{{ApiNameCapitalized}}": apiNameCapitalized,
    "{{ApiNameUpper}}": apiName.toUpperCase(),
  });

  mkdirSync(join(controllerPath, ".."), { recursive: true });

  writeFileSync(controllerPath, controllerTemplate);
}

module.exports = {
  ensureExistingController,
  ensureNewController,
};
