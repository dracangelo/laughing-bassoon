export function sanitizeRegistration(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 12);
}

export function sanitizePartNumber(value: string) {
  return value.replace(/[^a-zA-Z0-9\-_.]/g, "").toUpperCase().slice(0, 32);
}
