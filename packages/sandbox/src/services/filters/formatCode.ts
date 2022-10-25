/**
 * Convert given code to formatted js notation removing quotes around properties and replacing double quotes.
 *
 * @param {*} code - Code to convert.
 * @param {string} mode - Format mode. If 'javascript' will replace/remove quotes.
 *
 * @returns {string}
 */
export const formatCode = (code, mode = 'javascript') => {
  if (typeof code === 'string') {
    code = JSON.parse(code);
  }

  const JSON_INDENT = 2;

  const json = JSON.stringify(code, null, JSON_INDENT);

  if (mode === 'javascript') {
    return json.replace(/"(\w+?)":\s/g, '$1: ');
  }

  return json;
};
