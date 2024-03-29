const { type } = require("os");

const EQUAL_CHAR = "=",
  SLASH_CHAR = "/",
  SPACE_CHAR = " ",
  COMMA_SPACE = ", ",
  SPACE_COMMA = " ,",
  COMMA_CHAR = ",",
  EMPTY_CHAR = "";

function capitalize(text) {
  if (!text) return null;

  return text.charAt(0).toUpperCase() + text.slice(1);
}

function toCamelCase(text) {
  if (!text) return null;

  return text.charAt(0).toLowerCase() + text.slice(1);
}

function replaceAll(text, keyValueObject) {
  if (!text) return null;

  Object.keys(keyValueObject).forEach((key) => {
    text = text.replace(new RegExp(key, "g"), keyValueObject[key]);
  });
  return text;
}

function addCharToStar(text, char) {
  if (!text) return null;

  if (text.charAt(0) !== char) {
    text = char + text;
  }
  return text;
}

function pathToOS(path) {
  if (!path) return null;

  return type() === "Windows_NT" ? path.replace(/\\/g, "/") : path;
}

function replaceDoubleSpaces(text) {
  if (!text) return null;

  return text.replace(/\s\s+/g, " ");
}

module.exports = {
  EQUAL_CHAR,
  SLASH_CHAR,
  SPACE_CHAR,
  COMMA_SPACE,
  SPACE_COMMA,
  COMMA_CHAR,
  EMPTY_CHAR,
  capitalize,
  toCamelCase,
  replaceAll,
  addCharToStar,
  pathToOS,
  replaceDoubleSpaces,
};
