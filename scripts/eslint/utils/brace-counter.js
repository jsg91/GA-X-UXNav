/**
 * Brace counting utility for ESLint rules
 * Extracts text blocks between matching braces
 */

/**
 * Find the matching closing brace for an opening brace
 * @param {string} text - The text to search in
 * @param {number} startPos - The position after the opening brace
 * @returns {number|null} The position of the matching closing brace, or null if not found
 */
function findMatchingBrace(text, startPos) {
  let braceCount = 1;
  let pos = startPos;
  
  while (pos < text.length && braceCount > 0) {
    if (text[pos] === '{') braceCount++;
    if (text[pos] === '}') braceCount--;
    pos++;
  }
  
  return braceCount === 0 ? pos - 1 : null;
}

/**
 * Extract text block between matching braces
 * @param {string} text - The text to search in
 * @param {RegExpMatchArray} match - The regex match result containing the opening brace pattern
 * @returns {string|null} The extracted text block, or null if not found
 */
function extractBraceBlock(text, match) {
  if (!match) return null;
  
  const startPos = match.index + match[0].length;
  const endPos = findMatchingBrace(text, startPos);
  
  if (endPos === null) return null;
  
  return text.substring(startPos, endPos);
}

module.exports = {
  findMatchingBrace,
  extractBraceBlock,
};

