import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { hashSync } from "bcryptjs";

export type StoredTurbo = {
  id: number;
  sku: string;
  make: string;
  model: string;
  year?: number;
  engine: string;
  bhp?: number;
  type: string;
  price: number;
  tradePrice?: number;
  stock: number;
  seoSlug: string;
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
};

export type StoredUser = {
  id: number;
  email: string;
  passwordHash: string;
  role: "customer" | "b2b" | "admin";
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  createdAt: string;
};

export type StoredSession = {
  id: string;
  userId: number;
  email: string;
  role: "customer" | "b2b" | "admin";
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
  lastSeenAt: string;
  expiresAt: string;
  revokedAt?: string;
};

export type StoredCartItem = {
  turboId: number;
  quantity: number;
};

export type StoredCart = {
  id: string;
  userId?: number;
  sessionId: string;
  items: StoredCartItem[];
  updatedAt: string;
};

export type StoredOrderItem = {
  turboId: number;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

export type StoredOrder = {
  id: number;
  userId?: number;
  email: string;
  status: string;
  total: number;
  stripePaymentId?: string;
  stripeSessionId?: string;
  invoiceNumber: string;
  invoicePath?: string;
  shippingAddress: string;
  items: StoredOrderItem[];
  createdAt: string;
};

export type StoredLookup = {
  id: number;
  registration: string;
  source: "api" | "db" | "cache";
  userIp?: string;
  vehicle?: Record<string, unknown>;
  createdAt: string;
};

export type StoredIpBlock = {
  id: number;
  ipAddress: string;
  reason: string;
  redirectUrl?: string;
  blockedAt: string;
};

export type StoredContactMessage = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
};

export type StoredBlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage?: string;
  publishedAt: string;
  tags: string[];
};

export type StoredEbayListing = {
  id: number;
  turboId?: number;
  listingType: "Turbo" | "CHRA";
  title: string;
  turboNumber: string;
  status: "draft" | "submitted" | "failed";
  ebayItemId?: string;
  createdAt: string;
};

export type StoredSecurityAudit = {
  id: number;
  provider: string;
  status: string;
  notes: string;
  createdAt: string;
};

export type AppData = {
  users: StoredUser[];
  sessions: StoredSession[];
  turbos: StoredTurbo[];
  carts: StoredCart[];
  orders: StoredOrder[];
  lookups: StoredLookup[];
  ipBlocks: StoredIpBlock[];
  contactMessages: StoredContactMessage[];
  blogPosts: StoredBlogPost[];
  ebayListings: StoredEbayListing[];
  auditRuns: StoredSecurityAudit[];
};

const defaultData: AppData = {
  users: [
    {
      id: 1,
      email: "admin@aceturbo.co.uk",
      passwordHash: hashSync("ChangeMe12345!", 10),
      role: "admin",
      firstName: "Ace",
      lastName: "Admin",
      createdAt: new Date().toISOString()
    }
  ],
  sessions: [],
  turbos: [
    {
      id: 1,
      sku: "ACE-GT1749V",
      make: "Alfa Romeo",
      model: "146",
      year: 2003,
      engine: "1.9 JTD",
      bhp: 150,
      type: "OEM Remanufactured",
      price: 295,
      tradePrice: 262,
      stock: 8,
      seoSlug: "alfa-romeo-146-19-jtd-ace-gt1749v",
      description: "OEM remanufactured turbocharger with warranty-backed workshop support.",
      images: ["/images/ace-turbo-preview.svg"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      sku: "ACE-BW-K03",
      make: "Volkswagen",
      model: "Golf",
      year: 2012,
      engine: "2.0 TDI",
      bhp: 140,
      type: "New Replacement",
      price: 325,
      tradePrice: 289,
      stock: 5,
      seoSlug: "volkswagen-golf-20-tdi-ace-bw-k03",
      description: "New replacement turbocharger for workshop and trade customers.",
      images: ["/images/ace-turbo-preview.svg"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  carts: [],
  orders: [],
  lookups: [],
  ipBlocks: [],
  contactMessages: [],
  blogPosts: [
    {
      id: 1,
      slug: "how-to-spot-a-failing-turbocharger",
      title: "How to Spot a Failing Turbocharger Before It Fails Completely",
      excerpt: "A practical guide to boost loss, smoke, whine, and oil issues that usually show up before total failure.",
      body: "Turbochargers usually tell you something is wrong before they give up entirely. Common warning signs include loss of boost, unusual whining, blue smoke, and oil contamination around the intake path. Workshop diagnosis should check pipework, actuator movement, shaft play, and contamination before replacement is approved.",
      coverImage: "/images/ace-turbo-preview.svg",
      publishedAt: "2026-05-10T09:00:00.000Z",
      tags: ["diagnostics", "advice"]
    },
    {
      id: 2,
      slug: "why-reg-lookups-save-time-in-the-workshop",
      title: "Why Registration Lookups Save Time in the Workshop",
      excerpt: "Faster identification means fewer wrong-part orders and cleaner communication with customers.",
      body: "A cleaned registration lookup can reduce wasted time at the counter, especially when customers arrive without part numbers. The key is to sanitize input, prefer cached records, and only call external APIs when needed, then log the source used for reporting.",
      coverImage: "/images/ace-turbo-preview.svg",
      publishedAt: "2026-05-11T09:00:00.000Z",
      tags: ["workflow", "lookup"]
    }
  ],
  ebayListings: [],
  auditRuns: []
};

const dataDir = path.join(process.cwd(), ".data");
const dataFile = path.join(dataDir, "app-data.json");

async function ensureDataFile() {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(dataFile, "utf8");
  } catch {
    await writeFile(dataFile, JSON.stringify(defaultData, null, 2), "utf8");
  }
}

export async function readAppData() {
  await ensureDataFile();
  const raw = await readFile(dataFile, "utf8");
  const data = JSON.parse(raw) as AppData;
  if (!data.users.some((user) => user.email === "admin@aceturbo.co.uk")) {
    data.users.unshift(defaultData.users[0]);
    await writeAppData(data);
  }
  return data;
}

export async function writeAppData(data: AppData) {
  await ensureDataFile();
  await writeFile(dataFile, JSON.stringify(data, null, 2), "utf8");
}

export async function updateAppData<T>(updater: (data: AppData) => T | Promise<T>) {
  const data = await readAppData();
  const result = await updater(data);
  await writeAppData(data);
  return result;
}

export function nextId(items: Array<{ id: number }>) {
  return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}
