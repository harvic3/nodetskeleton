const { COMMA_SPACE, SPACE_COMMA, COMMA_CHAR } = require("../stringUtils");
const { replaceAll, replaceDoubleSpaces } = require("../stringUtils");
const { writeFileSync, mkdirSync, readFileSync } = require("fs");
const { templates } = require("../templates");
const { join } = require("path");
const {
  addLinesBeforePosition,
  replaceContentLineInPosition,
  getLinePositionByContentInverse,
  addContentToBeginning,
} = require("../fileUtils");

function ensureExistingContainer(settingsFile, containerPath, useCaseName, apiName, actionName) {
  let controllerContainerContent = readFileSync(containerPath, "utf8");
  const containerExportLineNumber = getLinePositionByContentInverse(
    controllerContainerContent,
    settingsFile.containerExportLineToFind,
  );
  const exportContainerContent = replaceAll(templates.exportContainerTemplate + COMMA_SPACE, {
    "{{UseCaseName}}": useCaseName,
  });
  controllerContainerContent = replaceContentLineInPosition(
    controllerContainerContent,
    containerExportLineNumber,
    settingsFile.containerExportLineToFind,
    exportContainerContent.replaceAll(SPACE_COMMA, COMMA_CHAR),
  );
  const useCaseContainerTemplate = replaceDoubleSpaces(
    replaceAll(templates.addUseCaseContainerTemplate, {
      "{{UseCaseName}}": useCaseName,
    }),
  );
  controllerContainerContent = addLinesBeforePosition(
    controllerContainerContent,
    containerExportLineNumber,
    useCaseContainerTemplate,
  );
  const importContainerContent = replaceAll(templates.importContainerTemplate, {
    "{{UseCaseName}}": useCaseName,
    "{{ApiName}}": apiName,
    "{{ActionName}}": actionName,
  });
  controllerContainerContent = addContentToBeginning(
    controllerContainerContent,
    importContainerContent,
  );

  writeFileSync(containerPath, controllerContainerContent);
}

function ensureNewContainer(containerPath, useCaseName, apiName, actionName) {
  const controllerContainerTemplate = replaceAll(templates.controllerContainerTemplate, {
    "{{UseCaseName}}": useCaseName,
    "{{ApiName}}": apiName,
    "{{ActionName}}": actionName,
  });

  mkdirSync(join(containerPath, ".."), { recursive: true });

  writeFileSync(containerPath, controllerContainerTemplate);
}

module.exports = {
  ensureExistingContainer,
  ensureNewContainer,
};
