export const replaceSpaces = (str: string) => {
  if (!str) return "";

  return str
    .trim()
    .replace(/\r\n?|\n/g, "")
    .replace("&#x2028;", "")
    .replace(/\s\s+/g, " ")
    .replace(/<sup>.*<\/sup>/g, "");
};

export function format(format: string, ...args) {
  const replaceArgs = Array.prototype.slice.call(arguments, 1);
  return format.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != "undefined" ? replaceArgs[number] : match;
  });
}