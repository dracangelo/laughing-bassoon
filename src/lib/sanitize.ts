import validator from "validator";

export function sanitizeRegistration(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 12);
}

export function sanitizePartNumber(value: string) {
  return value.replace(/[^a-zA-Z0-9\-_.]/g, "").toUpperCase().slice(0, 32);
}

export function sanitizeText(value: string, maxLength = 160) {
  return validator
    .stripLow(validator.escape(value.replace(/[{}]/g, "")), true)
    .trim()
    .slice(0, maxLength);
}

export function slugify(value: string) {
  return sanitizeText(value, 120)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function sanitizeHtmlInput(value: string, maxLength = 5000) {
  return sanitizeText(value.replace(/<\/?[^>]+(>|$)/g, " "), maxLength);
}
