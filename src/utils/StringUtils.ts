export const replaceSpaces = (str: string) => {
    if (!str)
        return "";

    return str.trim()
        .replace(/\r\n?|\n/g, '')
        .replace("&#x2028;", '')
        .replace(/\s\s+/g, ' ')
        .replace(/<sup>.*<\/sup>/g, '');
}