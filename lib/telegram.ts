export function stripTelegramPrefix(value: string): string {
  return value.replace(/^@+/, "");
}

export function formatTelegramUsername(value: string): string {
  const nickname = stripTelegramPrefix(value.trim());
  if (!nickname) return "";
  return `@${nickname}`;
}
