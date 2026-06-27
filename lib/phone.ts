const COUNTRY_CODE = "7";
const MAX_LENGTH = 11;

export function normalizePhoneDigits(input: string): string {
  let digits = input.replace(/\D/g, "");

  if (!digits) return COUNTRY_CODE;

  if (digits.startsWith("8")) {
    digits = COUNTRY_CODE + digits.slice(1);
  } else if (digits.startsWith("9")) {
    digits = COUNTRY_CODE + digits;
  } else if (!digits.startsWith(COUNTRY_CODE)) {
    digits = COUNTRY_CODE + digits;
  }

  return digits;
}

export function truncatePhoneDigits(digits: string): string {
  const normalized = digits.startsWith(COUNTRY_CODE) ? digits : normalizePhoneDigits(digits);
  return normalized.slice(0, MAX_LENGTH);
}

export function formatPhoneMask(input: string): string {
  const digits = truncatePhoneDigits(normalizePhoneDigits(input));
  const national = digits.slice(1);

  if (!national) return "+7";

  let formatted = `+7 (${national.slice(0, 3)}`;

  if (national.length <= 3) return formatted;

  formatted = `+7 (${national.slice(0, 3)}) ${national.slice(3, 6)}`;

  if (national.length <= 6) return formatted;

  formatted += `-${national.slice(6, 8)}`;

  if (national.length <= 8) return formatted;

  return `${formatted}-${national.slice(8, 10)}`;
}

export function isPhoneComplete(input: string): boolean {
  return truncatePhoneDigits(normalizePhoneDigits(input)).length === MAX_LENGTH;
}

export function getPhoneDigits(input: string): string {
  return truncatePhoneDigits(normalizePhoneDigits(input));
}
