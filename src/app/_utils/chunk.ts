export const chunk = <T>(values: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  let lastChunk: T[] = [];
  for (const [i, value] of values.entries()) {
    lastChunk.push(value);
    if (lastChunk.length >= size || i === values.length - 1) {
      chunks.push(lastChunk);
      lastChunk = [];
    }
  }
  return chunks;
};
