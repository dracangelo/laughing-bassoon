import { pool } from "@/lib/db";
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

function useMysql() {
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
    tradePrice: row.trade_price != null || row.tradePrice != null ? Number(row.trade_price ?? row.tradePrice) : undefined,
    stock: row.stock,
    seoSlug: row.seo_slug ?? row.seoSlug,
    description: row.description || "",
    images: typeof row.images === 'string' ? JSON.parse(row.images) : (Array.isArray(row.images) ? row.images : []),
    createdAt: new Date(row.created_at ?? row.createdAt).toISOString(),
    updatedAt: new Date(row.updated_at ?? row.updatedAt).toISOString()
  };
}

function mapUser(row: any): StoredUser {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash ?? row.passwordHash,
    role: row.role,
    firstName: row.first_name ?? row.firstName ?? "",
    lastName: row.last_name ?? row.lastName ?? "",
    company: row.company || undefined,
    phone: row.phone || undefined,
    createdAt: new Date(row.created_at ?? row.createdAt).toISOString()
  };
}

function mapSession(row: any): StoredSession {
  return {
    id: row.id,
    userId: row.user_id ?? row.userId,
    email: row.email,
    role: row.role,
    userAgent: row.user_agent ?? row.userAgent ?? undefined,
    ipAddress: row.ip_address ?? row.ipAddress ?? undefined,
    createdAt: new Date(row.created_at ?? row.createdAt).toISOString(),
    lastSeenAt: new Date(row.last_seen_at ?? row.lastSeenAt).toISOString(),
    expiresAt: new Date(row.expires_at ?? row.expiresAt).toISOString(),
    revokedAt: (row.revoked_at ?? row.revokedAt) ? new Date(row.revoked_at ?? row.revokedAt).toISOString() : undefined
  };
}

function mapOrder(row: any): StoredOrder {
  return {
    id: row.id,
    userId: row.user_id ?? row.userId ?? undefined,
    email: row.email || "",
    status: row.status,
    total: Number(row.total),
    stripePaymentId: row.stripe_payment_id ?? row.stripePaymentId ?? undefined,
    stripeSessionId: row.stripe_session_id ?? row.stripeSessionId ?? undefined,
    invoiceNumber: row.invoice_number ?? row.invoiceNumber ?? "",
    invoicePath: row.invoice_path ?? row.invoicePath ?? undefined,
    shippingAddress: row.shipping_address ?? row.shippingAddress ?? "",
    createdAt: new Date(row.created_at ?? row.createdAt).toISOString(),
    items: Array.isArray(row.items)
      ? row.items.map((item: any) => ({
          turboId: item.turbo_id ?? item.turboId,
          sku: item.sku || item.turbo?.sku || "",
          name: item.name || `${item.turbo?.make || ""} ${item.turbo?.model || ""} ${item.turbo?.engine || ""}`.trim(),
          quantity: item.quantity,
          unitPrice: Number(item.unit_price ?? item.unitPrice)
        }))
      : []
  };
}

function mapLookup(row: any): StoredLookup {
  return {
    id: row.id,
    registration: row.registration,
    source: row.source,
    userIp: row.user_ip ?? row.userIp ?? undefined,
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
  if (useMysql()) {
    const [rows] = await pool.query("SELECT * FROM users ORDER BY created_at ASC");
    return (rows as any[]).map(mapUser);
  }
  return (await readAppData()).users;
}

export async function findUserByEmail(email: string) {
  if (useMysql()) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    return (rows as any[])[0] ? mapUser((rows as any[])[0]) : null;
  }
  return (await readAppData()).users.find((user) => user.email === email) || null;
}

export async function createUserRecord(user: Omit<StoredUser, "id" | "createdAt">) {
  if (useMysql()) {
    const [result] = await pool.query(
      "INSERT INTO users (email, password_hash, role, first_name, last_name, company, phone) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [user.email, user.passwordHash, user.role, user.firstName, user.lastName, user.company, user.phone]
    );
    const id = (result as any).insertId;
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return mapUser((rows as any[])[0]);
  }
  return updateAppData((data) => {
    const created: StoredUser = { id: nextId(data.users), createdAt: new Date().toISOString(), ...user };
    data.users.push(created);
    return created;
  });
}

export async function createSessionRecord(session: StoredSession) {
  if (useMysql()) {
    await pool.query(
      "INSERT INTO sessions (id, user_id, email, role, user_agent, ip_address, created_at, last_seen_at, expires_at, revoked_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [session.id, session.userId, session.email, session.role, session.userAgent, session.ipAddress, new Date(session.createdAt), new Date(session.lastSeenAt), new Date(session.expiresAt), session.revokedAt ? new Date(session.revokedAt) : null]
    );
    const [rows] = await pool.query("SELECT * FROM sessions WHERE id = ?", [session.id]);
    return mapSession((rows as any[])[0]);
  }
  return updateAppData((data) => {
    data.sessions.push(session);
    return session;
  });
}

export async function getSessionRecord(id: string) {
  if (useMysql()) {
    const [rows] = await pool.query("SELECT * FROM sessions WHERE id = ? LIMIT 1", [id]);
    return (rows as any[])[0] ? mapSession((rows as any[])[0]) : null;
  }
  return (await readAppData()).sessions.find((session) => session.id === id) || null;
}

export async function getSessions(filters?: { userId?: number; activeOnly?: boolean }) {
  if (useMysql()) {
    let query = "SELECT * FROM sessions";
    const params: any[] = [];
    const conditions: string[] = [];
    
    if (filters?.userId) {
      conditions.push("user_id = ?");
      params.push(filters.userId);
    }
    if (filters?.activeOnly) {
      conditions.push("revoked_at IS NULL");
      conditions.push("expires_at > NOW()");
    }
    
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    query += " ORDER BY created_at DESC";
    
    const [rows] = await pool.query(query, params);
    return (rows as any[]).map(mapSession);
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
  if (useMysql()) {
    await pool.query("UPDATE sessions SET last_seen_at = NOW() WHERE id = ?", [id]);
    const [rows] = await pool.query("SELECT * FROM sessions WHERE id = ?", [id]);
    return mapSession((rows as any[])[0]);
  }
  return updateAppData((data) => {
    const session = data.sessions.find((entry) => entry.id === id);
    if (!session) return null;
    session.lastSeenAt = new Date().toISOString();
    return session;
  });
}

export async function revokeSessionRecord(id: string) {
  if (useMysql()) {
    await pool.query("UPDATE sessions SET revoked_at = NOW() WHERE id = ?", [id]);
    const [rows] = await pool.query("SELECT * FROM sessions WHERE id = ?", [id]);
    return mapSession((rows as any[])[0]);
  }
  return updateAppData((data) => {
    const session = data.sessions.find((entry) => entry.id === id);
    if (!session) return null;
    session.revokedAt = new Date().toISOString();
    return session;
  });
}

export async function revokeSessionsForUser(userId: number, exceptId?: string) {
  if (useMysql()) {
    let query = "UPDATE sessions SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL";
    const params: any[] = [userId];
    if (exceptId) {
      query += " AND id != ?";
      params.push(exceptId);
    }
    await pool.query(query, params);
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
  if (useMysql()) {
    await pool.query("UPDATE users SET role = ? WHERE id = ?", [role, userId]);
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [userId]);
    return mapUser((rows as any[])[0]);
  }
  return updateAppData((data) => {
    const existing = data.users.find((user) => user.id === userId);
    if (!existing) return null;
    existing.role = role;
    return existing;
  });
}

export async function getTurbos(filters?: TurboSearch) {
  if (useMysql()) {
    let query = "SELECT * FROM turbos";
    const params: any[] = [];
    const conditions: string[] = [];
    
    if (filters?.partNumber) {
      conditions.push("sku LIKE ?");
      params.push(`%${filters.partNumber}%`);
    }
    if (filters?.make) {
      conditions.push("make = ?");
      params.push(filters.make);
    }
    if (filters?.model) {
      conditions.push("model = ?");
      params.push(filters.model);
    }
    if (filters?.engine) {
      conditions.push("engine = ?");
      params.push(filters.engine);
    }
    if (filters?.year) {
      conditions.push("year = ?");
      params.push(filters.year);
    }
    if (filters?.bhp) {
      conditions.push("bhp = ?");
      params.push(filters.bhp);
    }
    
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    query += " ORDER BY created_at DESC";
    
    const [rows] = await pool.query(query, params);
    return (rows as any[]).map(mapTurbo);
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
  if (useMysql()) {
    const [rows] = await pool.query("SELECT * FROM turbos WHERE id = ? LIMIT 1", [id]);
    return (rows as any[])[0] ? mapTurbo((rows as any[])[0]) : null;
  }
  return (await readAppData()).turbos.find((turbo) => turbo.id === id) || null;
}

export async function getTurboBySlug(slug: string) {
  if (useMysql()) {
    const [rows] = await pool.query("SELECT * FROM turbos WHERE seo_slug = ? LIMIT 1", [slug]);
    return (rows as any[])[0] ? mapTurbo((rows as any[])[0]) : null;
  }
  return (await readAppData()).turbos.find((turbo) => turbo.seoSlug === slug) || null;
}

export async function createTurboRecord(turbo: Omit<StoredTurbo, "id" | "createdAt" | "updatedAt">) {
  if (useMysql()) {
    const [result] = await pool.query(
      "INSERT INTO turbos (sku, make, model, year, engine, bhp, type, price, trade_price, stock, images, description, seo_slug) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [turbo.sku, turbo.make, turbo.model, turbo.year, turbo.engine, turbo.bhp, turbo.type, turbo.price, turbo.tradePrice, turbo.stock, JSON.stringify(turbo.images), turbo.description, turbo.seoSlug]
    );
    const id = (result as any).insertId;
    const [rows] = await pool.query("SELECT * FROM turbos WHERE id = ?", [id]);
    return mapTurbo((rows as any[])[0]);
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
  if (useMysql()) {
    const updates: string[] = [];
    const params: any[] = [];
    
    if (patch.sku !== undefined) { updates.push("sku = ?"); params.push(patch.sku); }
    if (patch.make !== undefined) { updates.push("make = ?"); params.push(patch.make); }
    if (patch.model !== undefined) { updates.push("model = ?"); params.push(patch.model); }
    if (patch.year !== undefined) { updates.push("year = ?"); params.push(patch.year); }
    if (patch.engine !== undefined) { updates.push("engine = ?"); params.push(patch.engine); }
    if (patch.bhp !== undefined) { updates.push("bhp = ?"); params.push(patch.bhp); }
    if (patch.type !== undefined) { updates.push("type = ?"); params.push(patch.type); }
    if (patch.price !== undefined) { updates.push("price = ?"); params.push(patch.price); }
    if (patch.tradePrice !== undefined) { updates.push("trade_price = ?"); params.push(patch.tradePrice); }
    if (patch.stock !== undefined) { updates.push("stock = ?"); params.push(patch.stock); }
    if (patch.images !== undefined) { updates.push("images = ?"); params.push(JSON.stringify(patch.images)); }
    if (patch.description !== undefined) { updates.push("description = ?"); params.push(patch.description); }
    if (patch.seoSlug !== undefined) { updates.push("seo_slug = ?"); params.push(patch.seoSlug); }
    
    if (updates.length > 0) {
      params.push(id);
      await pool.query(`UPDATE turbos SET ${updates.join(", ")} WHERE id = ?`, params);
    }
    const [rows] = await pool.query("SELECT * FROM turbos WHERE id = ?", [id]);
    return mapTurbo((rows as any[])[0]);
  }
  return updateAppData((data) => {
    const existing = data.turbos.find((turbo) => turbo.id === id);
    if (!existing) return null;
    Object.assign(existing, patch, { updatedAt: new Date().toISOString() });
    return existing;
  });
}

export async function deleteTurboRecord(id: number) {
  if (useMysql()) {
    const [rows] = await pool.query("SELECT * FROM turbos WHERE id = ?", [id]);
    if ((rows as any[]).length === 0) return null;
    await pool.query("DELETE FROM turbos WHERE id = ?", [id]);
    return mapTurbo((rows as any[])[0]);
  }
  return updateAppData((data) => {
    const index = data.turbos.findIndex((turbo) => turbo.id === id);
    if (index < 0) return null;
    return data.turbos.splice(index, 1)[0];
  });
}

export async function findVehicleByRegistration(registration: string) {
  if (useMysql()) {
    const [rows] = await pool.query("SELECT * FROM vehicles WHERE registration = ? LIMIT 1", [registration]);
    const row = (rows as any[])[0];
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
  if (useMysql()) {
    await pool.query(
      `INSERT INTO vehicles (registration, make, model, year, engine, fuel, colour, source) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE make=VALUES(make), model=VALUES(model), year=VALUES(year), engine=VALUES(engine), fuel=VALUES(fuel), colour=VALUES(colour), source=VALUES(source)`,
      [input.registration, input.make, input.model, input.year, input.engine, input.fuel, input.colour, input.source]
    );
    const [rows] = await pool.query("SELECT * FROM vehicles WHERE registration = ?", [input.registration]);
    return (rows as any[])[0];
  }
  return input;
}

export async function createLookupRecord(input: {
  registration: string;
  source: "api" | "db" | "cache";
  userIp?: string;
  vehicle?: Record<string, unknown>;
}) {
  if (useMysql()) {
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
      vehicleId = vehicle.id;
    }
    
    const [result] = await pool.query(
      "INSERT INTO lookup_log (registration, source, user_ip, vehicleId) VALUES (?, ?, ?, ?)",
      [input.registration, input.source, input.userIp, vehicleId]
    );
    
    const id = (result as any).insertId;
    const [rows] = await pool.query(
      "SELECT l.*, v.make as v_make, v.model as v_model, v.year as v_year, v.engine as v_engine, v.fuel as v_fuel, v.colour as v_colour FROM lookup_log l LEFT JOIN vehicles v ON l.vehicleId = v.id WHERE l.id = ?",
      [id]
    );
    const row = (rows as any[])[0];
    if (row.vehicleId) {
       row.vehicle = { registration: row.registration, make: row.v_make, model: row.v_model, year: row.v_year, engine: row.v_engine, fuel: row.v_fuel, colour: row.v_colour };
    }
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
  if (useMysql()) {
    const [rows] = await pool.query(
      "SELECT l.*, v.make as v_make, v.model as v_model, v.year as v_year, v.engine as v_engine, v.fuel as v_fuel, v.colour as v_colour FROM lookup_log l LEFT JOIN vehicles v ON l.vehicleId = v.id ORDER BY l.timestamp DESC"
    );
    return (rows as any[]).map((row) => {
      if (row.vehicleId) {
        row.vehicle = { registration: row.registration, make: row.v_make, model: row.v_model, year: row.v_year, engine: row.v_engine, fuel: row.v_fuel, colour: row.v_colour };
      }
      return mapLookup(row);
    });
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
  if (useMysql()) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [orderResult] = await connection.query(
        "INSERT INTO orders (user_id, email, status, total, stripe_payment_id, stripe_session_id, invoice_number, invoice_path, shipping_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [order.userId, order.email, order.status, order.total, order.stripePaymentId, order.stripeSessionId, order.invoiceNumber, order.invoicePath, order.shippingAddress]
      );
      const orderId = (orderResult as any).insertId;
      
      for (const item of order.items) {
        await connection.query(
          "INSERT INTO order_items (order_id, turbo_id, sku, name, quantity, unit_price) VALUES (?, ?, ?, ?, ?, ?)",
          [orderId, item.turboId, item.sku, item.name, item.quantity, item.unitPrice]
        );
      }
      await connection.commit();
      
      return getOrderRecordById(orderId);
    } catch (e) {
      await connection.rollback();
      throw e;
    } finally {
      connection.release();
    }
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
  if (useMysql()) {
    const updates: string[] = [];
    const params: any[] = [];
    
    if (patch.status !== undefined) { updates.push("status = ?"); params.push(patch.status); }
    if (patch.stripePaymentId !== undefined) { updates.push("stripe_payment_id = ?"); params.push(patch.stripePaymentId); }
    if (patch.stripeSessionId !== undefined) { updates.push("stripe_session_id = ?"); params.push(patch.stripeSessionId); }
    if (patch.invoiceNumber !== undefined) { updates.push("invoice_number = ?"); params.push(patch.invoiceNumber); }
    if (patch.invoicePath !== undefined) { updates.push("invoice_path = ?"); params.push(patch.invoicePath); }
    
    if (updates.length > 0) {
      params.push(orderId);
      await pool.query(`UPDATE orders SET ${updates.join(", ")} WHERE id = ?`, params);
    }
    
    return getOrderRecordById(orderId);
  }
  return updateAppData((data) => {
    const existing = data.orders.find((order) => order.id === orderId);
    if (!existing) return null;
    Object.assign(existing, patch);
    return existing;
  });
}

export async function getOrdersForUser(userId: number, email: string) {
  if (useMysql()) {
    const [rows] = await pool.query("SELECT * FROM orders WHERE user_id = ? OR email = ? ORDER BY created_at DESC", [userId, email]);
    
    const orders = (rows as any[]).map(mapOrder);
    for (const order of orders) {
      const [items] = await pool.query("SELECT i.*, t.make, t.model, t.engine FROM order_items i JOIN turbos t ON i.turbo_id = t.id WHERE i.order_id = ?", [order.id]);
      order.items = (items as any[]).map(item => ({
        turboId: item.turbo_id,
        sku: item.sku,
        name: item.name || `${item.make || ""} ${item.model || ""} ${item.engine || ""}`.trim(),
        quantity: item.quantity,
        unitPrice: Number(item.unit_price)
      }));
    }
    return orders;
  }
  return (await readAppData()).orders.filter((order) => order.userId === userId || order.email === email);
}

export async function getAllOrders() {
  if (useMysql()) {
    const [rows] = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
    
    const orders = (rows as any[]).map(mapOrder);
    for (const order of orders) {
      const [items] = await pool.query("SELECT i.*, t.make, t.model, t.engine FROM order_items i JOIN turbos t ON i.turbo_id = t.id WHERE i.order_id = ?", [order.id]);
      order.items = (items as any[]).map(item => ({
        turboId: item.turbo_id,
        sku: item.sku,
        name: item.name || `${item.make || ""} ${item.model || ""} ${item.engine || ""}`.trim(),
        quantity: item.quantity,
        unitPrice: Number(item.unit_price)
      }));
    }
    return orders;
  }
  return (await readAppData()).orders;
}

export async function getOrderRecordById(id: number) {
  if (useMysql()) {
    const [rows] = await pool.query("SELECT * FROM orders WHERE id = ? LIMIT 1", [id]);
    const row = (rows as any[])[0];
    if (!row) return null;
    
    const order = mapOrder(row);
    const [items] = await pool.query("SELECT i.*, t.make, t.model, t.engine FROM order_items i JOIN turbos t ON i.turbo_id = t.id WHERE i.order_id = ?", [id]);
    order.items = (items as any[]).map(item => ({
      turboId: item.turbo_id,
      sku: item.sku,
      name: item.name || `${item.make || ""} ${item.model || ""} ${item.engine || ""}`.trim(),
      quantity: item.quantity,
      unitPrice: Number(item.unit_price)
    }));
    return order;
  }
  return (await readAppData()).orders.find((order) => order.id === id) || null;
}

export async function updateOrderStatusRecord(id: number, status: string) {
  if (useMysql()) {
    await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    return getOrderRecordById(id);
  }
  return updateAppData((data) => {
    const existing = data.orders.find((order) => order.id === id);
    if (!existing) return null;
    existing.status = status;
    return existing;
  });
}

export async function getIpBlocks() {
  if (useMysql()) {
    const [rows] = await pool.query("SELECT * FROM ip_blocks ORDER BY blocked_at DESC");
    return (rows as any[]).map((row: any) => ({
      id: row.id,
      ipAddress: row.ip_address,
      reason: row.reason,
      redirectUrl: row.redirect_url || undefined,
      blockedAt: new Date(row.blocked_at).toISOString()
    }));
  }
  return (await readAppData()).ipBlocks;
}

export async function createIpBlockRecord(block: Omit<StoredIpBlock, "id" | "blockedAt">) {
  if (useMysql()) {
    const [result] = await pool.query(
      "INSERT INTO ip_blocks (ip_address, reason, redirect_url) VALUES (?, ?, ?)",
      [block.ipAddress, block.reason, block.redirectUrl]
    );
    const id = (result as any).insertId;
    const [rows] = await pool.query("SELECT * FROM ip_blocks WHERE id = ?", [id]);
    const row = (rows as any[])[0];
    return {
      id: row.id,
      ipAddress: row.ip_address,
      reason: row.reason,
      redirectUrl: row.redirect_url || undefined,
      blockedAt: new Date(row.blocked_at).toISOString()
    };
  }
  return updateAppData((data) => {
    const created: StoredIpBlock = { id: nextId(data.ipBlocks), blockedAt: new Date().toISOString(), ...block };
    data.ipBlocks.push(created);
    return created;
  });
}

export async function deleteIpBlockRecord(blockId: number) {
  if (useMysql()) {
    const [rows] = await pool.query("SELECT * FROM ip_blocks WHERE id = ?", [blockId]);
    if ((rows as any[]).length === 0) return null;
    const row = (rows as any[])[0];
    await pool.query("DELETE FROM ip_blocks WHERE id = ?", [blockId]);
    return {
      id: row.id,
      ipAddress: row.ip_address,
      reason: row.reason,
      redirectUrl: row.redirect_url || undefined,
      blockedAt: new Date(row.blocked_at).toISOString()
    };
  }
  return updateAppData((data) => {
    const index = data.ipBlocks.findIndex((block) => block.id === blockId);
    if (index < 0) return null;
    return data.ipBlocks.splice(index, 1)[0];
  });
}
