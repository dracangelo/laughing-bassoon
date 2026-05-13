import { prisma } from "@/lib/db";
import {
  nextId,
  readAppData,
  updateAppData,
  type StoredIpBlock,
  type StoredLookup,
  type StoredOrder,
  type StoredSession,
  type StoredTurbo,
  type StoredUser
} from "@/lib/persistence";

type TurboSearch = {
  partNumber?: string;
  make?: string;
  model?: string;
  engine?: string;
  year?: number;
  bhp?: number;
};

function usePrisma() {
  const url = process.env.DATABASE_URL;
  return Boolean(url && !url.includes("user:pass@host"));
}

function mapTurbo(row: any): StoredTurbo {
  return {
    id: row.id,
    sku: row.sku,
    make: row.make,
    model: row.model,
    year: row.year ?? undefined,
    engine: row.engine,
    bhp: row.bhp ?? undefined,
    type: row.type,
    price: Number(row.price),
    tradePrice: row.tradePrice != null ? Number(row.tradePrice) : undefined,
    stock: row.stock,
    seoSlug: row.seoSlug,
    description: row.description || "",
    images: Array.isArray(row.images) ? row.images : [],
    createdAt: new Date(row.createdAt).toISOString(),
    updatedAt: new Date(row.updatedAt).toISOString()
  };
}

function mapUser(row: any): StoredUser {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    role: row.role,
    firstName: row.firstName || "",
    lastName: row.lastName || "",
    company: row.company || undefined,
    phone: row.phone || undefined,
    createdAt: new Date(row.createdAt).toISOString()
  };
}

function mapSession(row: any): StoredSession {
  return {
    id: row.id,
    userId: row.userId,
    email: row.email,
    role: row.role,
    userAgent: row.userAgent || undefined,
    ipAddress: row.ipAddress || undefined,
    createdAt: new Date(row.createdAt).toISOString(),
    lastSeenAt: new Date(row.lastSeenAt).toISOString(),
    expiresAt: new Date(row.expiresAt).toISOString(),
    revokedAt: row.revokedAt ? new Date(row.revokedAt).toISOString() : undefined
  };
}

function mapOrder(row: any): StoredOrder {
  return {
    id: row.id,
    userId: row.userId ?? undefined,
    email: row.email || "",
    status: row.status,
    total: Number(row.total),
    stripePaymentId: row.stripePaymentId || undefined,
    stripeSessionId: row.stripeSessionId || undefined,
    invoiceNumber: row.invoiceNumber || "",
    invoicePath: row.invoicePath || undefined,
    shippingAddress: row.shippingAddress || "",
    createdAt: new Date(row.createdAt).toISOString(),
    items: Array.isArray(row.items)
      ? row.items.map((item: any) => ({
          turboId: item.turboId,
          sku: item.sku || item.turbo?.sku || "",
          name: item.name || `${item.turbo?.make || ""} ${item.turbo?.model || ""} ${item.turbo?.engine || ""}`.trim(),
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice)
        }))
      : []
  };
}

function mapLookup(row: any): StoredLookup {
  return {
    id: row.id,
    registration: row.registration,
    source: row.source,
    userIp: row.userIp || undefined,
    vehicle: row.vehicle
      ? {
          registration: row.vehicle.registration,
          make: row.vehicle.make,
          model: row.vehicle.model,
          year: row.vehicle.year,
          engine: row.vehicle.engine,
          fuel: row.vehicle.fuel,
          colour: row.vehicle.colour
        }
      : undefined,
    createdAt: new Date(row.timestamp).toISOString()
  };
}

export async function getUsers() {
  if (usePrisma()) {
    const rows = await (prisma as any).user.findMany({ orderBy: { createdAt: "asc" } });
    return rows.map(mapUser);
  }
  return (await readAppData()).users;
}

export async function findUserByEmail(email: string) {
  if (usePrisma()) {
    const row = await (prisma as any).user.findUnique({ where: { email } });
    return row ? mapUser(row) : null;
  }
  return (await readAppData()).users.find((user) => user.email === email) || null;
}

export async function createUserRecord(user: Omit<StoredUser, "id" | "createdAt">) {
  if (usePrisma()) {
    const row = await (prisma as any).user.create({
      data: {
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        phone: user.phone
      }
    });
    return mapUser(row);
  }
  return updateAppData((data) => {
    const created: StoredUser = { id: nextId(data.users), createdAt: new Date().toISOString(), ...user };
    data.users.push(created);
    return created;
  });
}

export async function createSessionRecord(session: StoredSession) {
  if (usePrisma()) {
    const row = await (prisma as any).session.create({
      data: {
        id: session.id,
        userId: session.userId,
        email: session.email,
        role: session.role,
        userAgent: session.userAgent,
        ipAddress: session.ipAddress,
        createdAt: session.createdAt,
        lastSeenAt: session.lastSeenAt,
        expiresAt: session.expiresAt,
        revokedAt: session.revokedAt
      }
    });
    return mapSession(row);
  }
  return updateAppData((data) => {
    data.sessions.push(session);
    return session;
  });
}

export async function getSessionRecord(id: string) {
  if (usePrisma()) {
    const row = await (prisma as any).session.findUnique({ where: { id } });
    return row ? mapSession(row) : null;
  }
  return (await readAppData()).sessions.find((session) => session.id === id) || null;
}

export async function getSessions(filters?: { userId?: number; activeOnly?: boolean }) {
  if (usePrisma()) {
    const where: Record<string, unknown> = {};
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.activeOnly) {
      where.revokedAt = null;
      where.expiresAt = { gt: new Date() };
    }
    const rows = await (prisma as any).session.findMany({ where, orderBy: { createdAt: "desc" } });
    return rows.map(mapSession);
  }
  return (await readAppData()).sessions
    .filter((session) => {
      if (filters?.userId && session.userId !== filters.userId) return false;
      if (filters?.activeOnly && (session.revokedAt || new Date(session.expiresAt).getTime() <= Date.now())) return false;
      return true;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function touchSessionRecord(id: string) {
  if (usePrisma()) {
    const row = await (prisma as any).session.update({
      where: { id },
      data: { lastSeenAt: new Date() }
    });
    return mapSession(row);
  }
  return updateAppData((data) => {
    const session = data.sessions.find((entry) => entry.id === id);
    if (!session) return null;
    session.lastSeenAt = new Date().toISOString();
    return session;
  });
}

export async function revokeSessionRecord(id: string) {
  if (usePrisma()) {
    const row = await (prisma as any).session.update({
      where: { id },
      data: { revokedAt: new Date() }
    });
    return mapSession(row);
  }
  return updateAppData((data) => {
    const session = data.sessions.find((entry) => entry.id === id);
    if (!session) return null;
    session.revokedAt = new Date().toISOString();
    return session;
  });
}

export async function revokeSessionsForUser(userId: number, exceptId?: string) {
  if (usePrisma()) {
    await (prisma as any).session.updateMany({
      where: {
        userId,
        revokedAt: null,
        ...(exceptId ? { NOT: { id: exceptId } } : {})
      },
      data: { revokedAt: new Date() }
    });
    return getSessions({ userId });
  }
  return updateAppData((data) => {
    for (const session of data.sessions) {
      if (session.userId === userId && !session.revokedAt && session.id !== exceptId) {
        session.revokedAt = new Date().toISOString();
      }
    }
    return data.sessions.filter((session) => session.userId === userId);
  });
}

export async function updateUserRoleRecord(userId: number, role: StoredUser["role"]) {
  if (usePrisma()) {
    const row = await (prisma as any).user.update({ where: { id: userId }, data: { role } });
    return mapUser(row);
  }
  return updateAppData((data) => {
    const existing = data.users.find((user) => user.id === userId);
    if (!existing) return null;
    existing.role = role;
    return existing;
  });
}

export async function getTurbos(filters?: TurboSearch) {
  if (usePrisma()) {
    const where: Record<string, unknown> = {};
    if (filters?.partNumber) where.sku = { contains: filters.partNumber };
    if (filters?.make) where.make = filters.make;
    if (filters?.model) where.model = filters.model;
    if (filters?.engine) where.engine = filters.engine;
    if (filters?.year) where.year = filters.year;
    if (filters?.bhp) where.bhp = filters.bhp;
    const rows = await (prisma as any).turbo.findMany({ where, orderBy: { createdAt: "desc" } });
    return rows.map(mapTurbo);
  }
  return (await readAppData()).turbos.filter((turbo) => {
    if (filters?.partNumber && !turbo.sku.includes(filters.partNumber)) return false;
    if (filters?.make && turbo.make !== filters.make) return false;
    if (filters?.model && turbo.model !== filters.model) return false;
    if (filters?.engine && turbo.engine !== filters.engine) return false;
    if (filters?.year && turbo.year !== filters.year) return false;
    if (filters?.bhp && turbo.bhp !== filters.bhp) return false;
    return true;
  });
}

export async function getTurboById(id: number) {
  if (usePrisma()) {
    const row = await (prisma as any).turbo.findUnique({ where: { id } });
    return row ? mapTurbo(row) : null;
  }
  return (await readAppData()).turbos.find((turbo) => turbo.id === id) || null;
}

export async function getTurboBySlug(slug: string) {
  if (usePrisma()) {
    const row = await (prisma as any).turbo.findUnique({ where: { seoSlug: slug } });
    return row ? mapTurbo(row) : null;
  }
  return (await readAppData()).turbos.find((turbo) => turbo.seoSlug === slug) || null;
}

export async function createTurboRecord(turbo: Omit<StoredTurbo, "id" | "createdAt" | "updatedAt">) {
  if (usePrisma()) {
    const row = await (prisma as any).turbo.create({
      data: {
        sku: turbo.sku,
        make: turbo.make,
        model: turbo.model,
        year: turbo.year,
        engine: turbo.engine,
        bhp: turbo.bhp,
        type: turbo.type,
        price: turbo.price,
        tradePrice: turbo.tradePrice,
        stock: turbo.stock,
        images: turbo.images,
        description: turbo.description,
        seoSlug: turbo.seoSlug
      }
    });
    return mapTurbo(row);
  }
  return updateAppData((data) => {
    const created: StoredTurbo = {
      id: nextId(data.turbos),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...turbo
    };
    data.turbos.push(created);
    return created;
  });
}

export async function updateTurboRecord(id: number, patch: Partial<StoredTurbo>) {
  if (usePrisma()) {
    const row = await (prisma as any).turbo.update({
      where: { id },
      data: {
        sku: patch.sku,
        make: patch.make,
        model: patch.model,
        year: patch.year,
        engine: patch.engine,
        bhp: patch.bhp,
        type: patch.type,
        price: patch.price,
        tradePrice: patch.tradePrice,
        stock: patch.stock,
        images: patch.images,
        description: patch.description,
        seoSlug: patch.seoSlug
      }
    });
    return mapTurbo(row);
  }
  return updateAppData((data) => {
    const existing = data.turbos.find((turbo) => turbo.id === id);
    if (!existing) return null;
    Object.assign(existing, patch, { updatedAt: new Date().toISOString() });
    return existing;
  });
}

export async function deleteTurboRecord(id: number) {
  if (usePrisma()) {
    const row = await (prisma as any).turbo.delete({ where: { id } });
    return mapTurbo(row);
  }
  return updateAppData((data) => {
    const index = data.turbos.findIndex((turbo) => turbo.id === id);
    if (index < 0) return null;
    return data.turbos.splice(index, 1)[0];
  });
}

export async function findVehicleByRegistration(registration: string) {
  if (usePrisma()) {
    const row = await (prisma as any).vehicle.findUnique({ where: { registration } });
    return row
      ? {
          registration: row.registration,
          make: row.make || undefined,
          model: row.model || undefined,
          year: row.year || undefined,
          engine: row.engine || undefined,
          fuel: row.fuel || undefined,
          colour: row.colour || undefined,
          source: row.source
        }
      : null;
  }
  return null;
}

export async function upsertVehicleRecord(input: {
  registration: string;
  make?: string;
  model?: string;
  year?: number;
  engine?: string;
  fuel?: string;
  colour?: string;
  source: "api" | "db" | "cache";
}) {
  if (usePrisma()) {
    const row = await (prisma as any).vehicle.upsert({
      where: { registration: input.registration },
      update: {
        make: input.make,
        model: input.model,
        year: input.year,
        engine: input.engine,
        fuel: input.fuel,
        colour: input.colour,
        source: input.source
      },
      create: input
    });
    return row;
  }
  return input;
}

export async function createLookupRecord(input: {
  registration: string;
  source: "api" | "db" | "cache";
  userIp?: string;
  vehicle?: Record<string, unknown>;
}) {
  if (usePrisma()) {
    let vehicleId: number | undefined;
    if (input.vehicle) {
      const vehicle = await upsertVehicleRecord({
        registration: input.registration,
        make: (input.vehicle.make as string) || undefined,
        model: (input.vehicle.model as string) || undefined,
        year: (input.vehicle.year as number) || undefined,
        engine: (input.vehicle.engine as string) || undefined,
        fuel: (input.vehicle.fuel as string) || undefined,
        colour: (input.vehicle.colour as string) || undefined,
        source: input.source
      });
      vehicleId = (vehicle as any).id;
    }
    const row = await (prisma as any).lookupLog.create({
      data: {
        registration: input.registration,
        source: input.source,
        userIp: input.userIp,
        vehicleId
      },
      include: { vehicle: true }
    });
    return mapLookup(row);
  }
  return updateAppData((data) => {
    const lookup: StoredLookup = {
      id: nextId(data.lookups),
      registration: input.registration,
      source: input.source,
      userIp: input.userIp,
      vehicle: input.vehicle,
      createdAt: new Date().toISOString()
    };
    data.lookups.push(lookup);
    return lookup;
  });
}

export async function getLookupRecords() {
  if (usePrisma()) {
    const rows = await (prisma as any).lookupLog.findMany({
      include: { vehicle: true },
      orderBy: { timestamp: "desc" }
    });
    return rows.map(mapLookup);
  }
  return (await readAppData()).lookups;
}

export async function getLookupStats() {
  const lookups = await getLookupRecords();
  return {
    totalLookups: lookups.length,
    apiCalls: lookups.filter((entry: StoredLookup) => entry.source === "api").length,
    dbHits: lookups.filter((entry: StoredLookup) => entry.source === "db").length,
    cacheHits: lookups.filter((entry: StoredLookup) => entry.source === "cache").length
  };
}

export async function createOrderRecord(order: Omit<StoredOrder, "id" | "createdAt">) {
  if (usePrisma()) {
    const row = await (prisma as any).order.create({
      data: {
        userId: order.userId,
        email: order.email,
        status: order.status,
        total: order.total,
        stripePaymentId: order.stripePaymentId,
        stripeSessionId: order.stripeSessionId,
        invoiceNumber: order.invoiceNumber,
        invoicePath: order.invoicePath,
        shippingAddress: order.shippingAddress,
        items: {
          create: order.items.map((item) => ({
            turboId: item.turboId,
            sku: item.sku,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice
          }))
        }
      },
      include: { items: { include: { turbo: true } } }
    });
    return mapOrder(row);
  }
  return updateAppData((data) => {
    const created: StoredOrder = {
      id: nextId(data.orders),
      createdAt: new Date().toISOString(),
      ...order
    };
    data.orders.push(created);
    return created;
  });
}

export async function updateOrderPaymentRecord(orderId: number, patch: Partial<StoredOrder>) {
  if (usePrisma()) {
    const row = await (prisma as any).order.update({
      where: { id: orderId },
      data: {
        status: patch.status,
        stripePaymentId: patch.stripePaymentId,
        stripeSessionId: patch.stripeSessionId,
        invoiceNumber: patch.invoiceNumber,
        invoicePath: patch.invoicePath
      },
      include: { items: { include: { turbo: true } } }
    });
    return mapOrder(row);
  }
  return updateAppData((data) => {
    const existing = data.orders.find((order) => order.id === orderId);
    if (!existing) return null;
    Object.assign(existing, patch);
    return existing;
  });
}

export async function getOrdersForUser(userId: number, email: string) {
  if (usePrisma()) {
    const rows = await (prisma as any).order.findMany({
      where: { OR: [{ userId }, { email }] },
      include: { items: { include: { turbo: true } } },
      orderBy: { createdAt: "desc" }
    });
    return rows.map(mapOrder);
  }
  return (await readAppData()).orders.filter((order) => order.userId === userId || order.email === email);
}

export async function getAllOrders() {
  if (usePrisma()) {
    const rows = await (prisma as any).order.findMany({
      include: { items: { include: { turbo: true } } },
      orderBy: { createdAt: "desc" }
    });
    return rows.map(mapOrder);
  }
  return (await readAppData()).orders;
}

export async function getOrderRecordById(id: number) {
  if (usePrisma()) {
    const row = await (prisma as any).order.findUnique({
      where: { id },
      include: { items: { include: { turbo: true } } }
    });
    return row ? mapOrder(row) : null;
  }
  return (await readAppData()).orders.find((order) => order.id === id) || null;
}

export async function updateOrderStatusRecord(id: number, status: string) {
  if (usePrisma()) {
    const row = await (prisma as any).order.update({
      where: { id },
      data: { status },
      include: { items: { include: { turbo: true } } }
    });
    return mapOrder(row);
  }
  return updateAppData((data) => {
    const existing = data.orders.find((order) => order.id === id);
    if (!existing) return null;
    existing.status = status;
    return existing;
  });
}

export async function getIpBlocks() {
  if (usePrisma()) {
    const rows = await (prisma as any).ipBlock.findMany({ orderBy: { blockedAt: "desc" } });
    return rows.map((row: any) => ({
      id: row.id,
      ipAddress: row.ipAddress,
      reason: row.reason,
      redirectUrl: row.redirectUrl || undefined,
      blockedAt: new Date(row.blockedAt).toISOString()
    }));
  }
  return (await readAppData()).ipBlocks;
}

export async function createIpBlockRecord(block: Omit<StoredIpBlock, "id" | "blockedAt">) {
  if (usePrisma()) {
    const row = await (prisma as any).ipBlock.create({ data: block });
    return {
      id: row.id,
      ipAddress: row.ipAddress,
      reason: row.reason,
      redirectUrl: row.redirectUrl || undefined,
      blockedAt: new Date(row.blockedAt).toISOString()
    };
  }
  return updateAppData((data) => {
    const created: StoredIpBlock = { id: nextId(data.ipBlocks), blockedAt: new Date().toISOString(), ...block };
    data.ipBlocks.push(created);
    return created;
  });
}

export async function deleteIpBlockRecord(blockId: number) {
  if (usePrisma()) {
    const row = await (prisma as any).ipBlock.delete({ where: { id: blockId } });
    return {
      id: row.id,
      ipAddress: row.ipAddress,
      reason: row.reason,
      redirectUrl: row.redirectUrl || undefined,
      blockedAt: new Date(row.blockedAt).toISOString()
    };
  }
  return updateAppData((data) => {
    const index = data.ipBlocks.findIndex((block) => block.id === blockId);
    if (index < 0) return null;
    return data.ipBlocks.splice(index, 1)[0];
  });
}
