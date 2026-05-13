export type Order = {
  id: number;
  status: "pending" | "paid" | "fulfilled" | "cancelled";
  total: number;
  stripePaymentId?: string;
};
