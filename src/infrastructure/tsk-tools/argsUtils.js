const availableAddUseCaseCommandArgs = [
  { argName: "api-name", aliases: ["a", "api", "-a", "-api"] },
  { argName: "use-case", aliases: ["u", "uc", "-u", "-uc"] },
  { argName: "endpoint", aliases: ["e", "ep", "-e", "-ep"] },
  {
    argName: "http-method",
    aliases: ["m", "h", "hm", "http", "method", "-m", "-h", "-hm", "-http", "-method"],
  },
];

function convertArgsToKeyValueArray(args, joinedBy) {
  if (!args?.length) return [];

  return args.map((arg) => {
    const [key, value] = arg.split(joinedBy);
    return { key, value };
  });
}

function getArgValue(argName, keyValueArgsArray, availableArgs) {
  const elegibleArgIndex = availableArgs.findIndex((elegible) => elegible.argName === argName);
  const elegibleArg = availableArgs[elegibleArgIndex];

  const argIndex = keyValueArgsArray.findIndex(
    (keyValueArg) =>
      keyValueArg.key.toLowerCase() === argName ||
      elegibleArg.aliases.includes(keyValueArg.key.toLowerCase()),
  );
  if (argIndex === -1) return null;
  const argValue = keyValueArgsArray[argIndex].value;

  availableArgs.splice(elegibleArgIndex, 1);
  keyValueArgsArray.splice(argIndex, 1);

  return argValue;
}

module.exports = {
  availableAddUseCaseCommandArgs,
  convertArgsToKeyValueArray,
  getArgValue,
};
