export function createInvoiceNumber(orderId: number) {
  return `ACE-${String(orderId).padStart(8, "0")}`;
}
