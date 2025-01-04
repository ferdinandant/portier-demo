type Opts = {};

export default function parseURL(
  pattern: string,
  url = document.location.pathname
): Record<string, string> {
  const result: Record<string, string> = {};
  const patternSplit = pattern.split("/");
  const urlSplit = url.split("/");

  for (let i = 0; i < patternSplit.length; i++) {
    const patternSegment = patternSplit[i];
    if (patternSegment.startsWith(":")) {
      const param = patternSegment.substring(1);
      const value = urlSplit[i];
      result[param] = value;
    }
  }

  return result;
}
