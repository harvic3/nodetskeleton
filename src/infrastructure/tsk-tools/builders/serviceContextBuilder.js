const { addLinesAfterPosition, getLinePositionByContent } = require("../fileUtils");
const { writeFileSync, readFileSync, existsSync } = require("fs");
const { replaceAll } = require("../stringUtils");
const { templates } = require("../templates");

function ensureServiceContext(settingsFile, serviceContextFilePath, apiName) {
  if (!existsSync(serviceContextFilePath)) return;

  const serviceContextContent = readFileSync(serviceContextFilePath, "utf8");
  const hasApiServiceContext = getLinePositionByContent(
    serviceContextContent,
    apiName.toUpperCase(),
  );
  if (hasApiServiceContext) return;

  const fileEndPosition = getLinePositionByContent(
    serviceContextContent,
    settingsFile.serviceContextLineToFind,
  );
  const serviceContextContentToAdd = replaceAll(templates.serviceContextNewLine, {
    "{{ApiNameUpper}}": apiName.toUpperCase(),
    "{{ApiName}}": apiName,
  });
  const newServiceContextContent = addLinesAfterPosition(
    serviceContextContent,
    fileEndPosition - 1,
    serviceContextContentToAdd,
  );

  writeFileSync(serviceContextFilePath, newServiceContextContent);
}

module.exports = {
  ensureServiceContext,
};
