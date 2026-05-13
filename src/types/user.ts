export type UserRole = "customer" | "b2b" | "admin";

export type User = {
  id: number;
  email: string;
  role: UserRole;
};
