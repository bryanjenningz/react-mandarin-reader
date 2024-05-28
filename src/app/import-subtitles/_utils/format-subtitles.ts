export const formatSubtitles = (subtitles: string): string => {
  const lines = subtitles.split("\n");
  return lines.filter((line, i) => lines[i - 1]?.match("-->")).join(" ");
};
