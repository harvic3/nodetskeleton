function getLinePositionByContent(text, contentToFind) {
  if (!text || !contentToFind) return null;

  const lines = text.split("\n");
  let linePosition = null;
  for (let index = 0; index < lines.length; index++) {
    if (lines[index].includes(contentToFind)) {
      linePosition = index;
      break;
    }
  }

  return linePosition;
}

function getLinePositionByContentInverse(text, contentToFind) {
  if (!text || !contentToFind) return null;

  const lines = text.split("\n");
  let linePosition = null;
  for (let index = lines.length - 1; index >= 0; index--) {
    if (lines[index].includes(contentToFind)) {
      linePosition = index;
      break;
    }
  }

  return linePosition;
}

function addLinesBeforePosition(text, position, textContentToAdd) {
  const linesContent = text.split("\n");
  const linesToAdd = textContentToAdd.split("\n");
  if (!linesContent?.length || !linesToAdd.length || position > linesContent.length) return null;

  linesContent.splice(position - 1, 1, ...linesToAdd);
  return linesContent.join("\n");
}

function addLinesAfterPosition(text, position, textContentToAdd) {
  const linesContent = text.split("\n");
  const linesToAdd = textContentToAdd.split("\n");
  if (!linesContent?.length || !linesToAdd.length || position > linesContent.length) return null;

  linesContent.splice(position + 1, 0, ...linesToAdd);
  return linesContent.join("\n");
}

function replaceContentLineInPosition(text, position, contentToFind, contentToReplace) {
  const linesContent = text.split("\n");
  if (!linesContent?.length || position > linesContent.length) return null;

  const line = linesContent[position];
  const lineContent = line.replace(contentToFind, contentToReplace);
  linesContent[position] = lineContent;
  return linesContent.join("\n");
}

function addContentToBeginning(text, contentToReplace) {
  const linesContent = text.split("\n");
  const linesToAdd = contentToReplace.split("\n");
  if (!linesContent?.length || !linesToAdd.length) return null;

  linesContent.unshift(...linesToAdd);
  return linesContent.join("\n");
}

module.exports = {
  getLinePositionByContent,
  getLinePositionByContentInverse,
  addLinesBeforePosition,
  addLinesAfterPosition,
  replaceContentLineInPosition,
  addContentToBeginning,
};
