import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { getSessionUser } from "@/lib/auth";
import { sendOrderEmail } from "@/lib/email";
import { createInvoiceNumber } from "@/lib/invoice";
import { buildCartView, clearCart } from "@/lib/cart";
import { type StoredOrder } from "@/lib/persistence";
import { createOrderRecord, getOrderRecordById, getOrdersForUser, updateOrderPaymentRecord } from "@/lib/data-access";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 12 },
  heading: { fontSize: 20, marginBottom: 12 },
  row: { marginBottom: 6 }
});

function InvoiceDocument({ order }: { order: StoredOrder }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>Ace Turbo Invoice {order.invoiceNumber}</Text>
        <Text style={styles.row}>Customer: {order.email}</Text>
        <Text style={styles.row}>Status: {order.status}</Text>
        <Text style={styles.row}>Address: {order.shippingAddress}</Text>
        <View style={{ marginTop: 14 }}>
          {order.items.map((item) => (
            <Text style={styles.row} key={`${item.sku}-${item.turboId}`}>
              {item.name} x {item.quantity} - GBP {item.unitPrice.toFixed(2)}
            </Text>
          ))}
        </View>
        <Text style={{ marginTop: 16 }}>Total: GBP {order.total.toFixed(2)}</Text>
      </Page>
    </Document>
  );
}

export async function createOrderFromCart(payload: { email: string; shippingAddress: string }) {
  const user = await getSessionUser();
  const cart = await buildCartView();
  if (!cart.items.length) throw new Error("Your cart is empty.");

  const tempInvoice = createInvoiceNumber(Date.now());
  const order = await createOrderRecord({
    userId: user?.id,
    email: payload.email,
    status: "pending_payment",
    total: cart.total,
    invoiceNumber: tempInvoice,
    shippingAddress: payload.shippingAddress,
    items: cart.items.map((item) => ({
      turboId: item!.turboId,
      sku: item!.sku,
      name: item!.name,
      quantity: item!.quantity,
      unitPrice: item!.unitPrice
    }))
  });

  await clearCart();
  if (!order) throw new Error("Failed to retrieve created order");
  if (!order.invoiceNumber || order.invoiceNumber === tempInvoice) {
    order.invoiceNumber = createInvoiceNumber(order.id);
    await updateOrderPaymentRecord(order.id, { invoiceNumber: order.invoiceNumber });
  }
  return order;
}

export async function markOrderPaid(orderId: number, stripePaymentId?: string, stripeSessionId?: string) {
  const order = await updateOrderPaymentRecord(orderId, {
    status: "paid",
    stripePaymentId,
    stripeSessionId
  });

  if (!order) return null;
  const invoicePath = await generateInvoicePdf(order);
  order.invoicePath = invoicePath;
  await updateOrderPaymentRecord(order.id, { invoicePath });
  await sendOrderEmail(
    order.email,
    `Ace Turbo order ${order.invoiceNumber}`,
    `<p>Thanks for your order.</p><p>Your invoice number is <strong>${order.invoiceNumber}</strong>.</p>`
  );
  return order;
}

export async function generateInvoicePdf(order: StoredOrder) {
  const outputDir = path.join(process.cwd(), ".data", "invoices");
  await mkdir(outputDir, { recursive: true });
  const buffer = await renderToBuffer(<InvoiceDocument order={order} />);
  const outputPath = path.join(outputDir, `${order.invoiceNumber}.pdf`);
  await writeFile(outputPath, buffer);
  return outputPath;
}

export async function listOrdersForCurrentUser() {
  const user = await getSessionUser();
  if (!user) return [];
  return getOrdersForUser(user.id, user.email);
}

export async function getOrderById(id: number) {
  return getOrderRecordById(id);
}
