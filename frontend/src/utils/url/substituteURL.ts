export default function substituteURL(
  pattern: string,
  substitutions: Record<string, string | number>
) {
  const result = pattern.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    const substitution =
      substitutions[key] !== undefined ? substitutions[key] : `:${key}`;
    return String(substitution);
  });

  if (result.includes(":")) {
    const ctxStr = JSON.stringify({ pattern, substitutions });
    throw new Error(`Failed to substitute URL: ${ctxStr}`);
  }
  return result;
}
