export function sanitizeRegistration(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 12);
}

export function sanitizePartNumber(value: string) {
  return value.replace(/[^a-zA-Z0-9\-_.]/g, "").toUpperCase().slice(0, 32);
}

export function sanitizeText(value: string, maxLength = 160) {
  return value.replace(/[<>`{}]/g, "").trim().slice(0, maxLength);
}

export function slugify(value: string) {
  return sanitizeText(value, 120)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
