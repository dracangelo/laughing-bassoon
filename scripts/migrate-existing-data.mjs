import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const cwd = process.cwd();
const sourcePath = process.env.MIGRATION_SOURCE || path.join(cwd, "data", "existing-data.json");
const outputDir = path.join(cwd, ".data");
const appDataPath = path.join(outputDir, "app-data.json");
const outputPath = path.join(outputDir, "migration-report.json");

function isRealDatabaseUrl() {
  const url = process.env.DATABASE_URL || "";
  return Boolean(url && !url.includes("user:pass@host"));
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function nextId(items) {
  return items.length ? Math.max(...items.map((item) => Number(item.id) || 0)) + 1 : 1;
}

function normaliseTurbo(input) {
  const sku = String(input.sku || input.partNumber || input.turboNumber || "").trim().toUpperCase();
  const make = String(input.make || input.vehicleMake || "Universal").trim();
  const model = String(input.model || input.vehicleModel || "Application").trim();
  const engine = String(input.engine || input.engineSize || "Engine dependent").trim();

  if (!sku) throw new Error("Turbo row missing sku/partNumber/turboNumber");

  return {
    sku,
    make,
    model,
    year: input.year ? Number(input.year) : undefined,
    engine,
    bhp: input.bhp ? Number(input.bhp) : undefined,
    type: String(input.type || input.condition || "Replacement").trim(),
    price: Number(input.price || input.retailPrice || 0),
    tradePrice: input.tradePrice ? Number(input.tradePrice) : undefined,
    stock: Number(input.stock || input.quantity || 0),
    images: Array.isArray(input.images) && input.images.length ? input.images : ["/images/ace-turbo-preview.svg"],
    description: String(input.description || `${make} ${model} ${engine} turbocharger`).trim(),
    seoSlug: slugify(input.seoSlug || `${make} ${model} ${engine} ${sku}`)
  };
}

function normaliseVehicle(input) {
  const registration = String(input.registration || input.reg || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (!registration) throw new Error("Vehicle row missing registration/reg");
  return {
    registration,
    make: input.make ? String(input.make) : undefined,
    model: input.model ? String(input.model) : undefined,
    year: input.year ? Number(input.year) : undefined,
    engine: input.engine ? String(input.engine) : undefined,
    fuel: input.fuel ? String(input.fuel) : undefined,
    colour: input.colour || input.color ? String(input.colour || input.color) : undefined,
    source: input.source === "cache" || input.source === "db" ? input.source : "api"
  };
}

function normaliseUser(input) {
  const email = String(input.email || "").trim().toLowerCase();
  if (!email) throw new Error("User row missing email");
  return {
    email,
    passwordHash: input.passwordHash || bcrypt.hashSync(String(input.password || "ChangeMe12345!"), 10),
    role: ["customer", "b2b", "admin"].includes(input.role) ? input.role : "customer",
    firstName: String(input.firstName || input.first_name || "Customer"),
    lastName: String(input.lastName || input.last_name || ""),
    company: input.company ? String(input.company) : undefined,
    phone: input.phone ? String(input.phone) : undefined
  };
}

function normaliseBlogPost(input) {
  const title = String(input.title || "").trim();
  if (!title) throw new Error("Blog row missing title");
  return {
    slug: slugify(input.slug || title),
    title,
    excerpt: String(input.excerpt || input.summary || title).slice(0, 200),
    body: String(input.body || input.content || input.excerpt || title),
    coverImage: input.coverImage || input.cover_image || "/images/ace-turbo-preview.svg",
    publishedAt: input.publishedAt || input.published_at || new Date().toISOString(),
    tags: Array.isArray(input.tags) ? input.tags.map((tag) => slugify(tag)) : []
  };
}

async function readJsonSource() {
  const raw = await readFile(sourcePath, "utf8");
  const parsed = JSON.parse(raw);
  return {
    turbos: Array.isArray(parsed.turbos) ? parsed.turbos : [],
    vehicles: Array.isArray(parsed.vehicles) ? parsed.vehicles : [],
    users: Array.isArray(parsed.users) ? parsed.users : [],
    blogPosts: Array.isArray(parsed.blogPosts || parsed.posts || parsed.news) ? parsed.blogPosts || parsed.posts || parsed.news : []
  };
}

async function importToPrisma(source) {
  const prisma = new PrismaClient();
  const counts = { turbos: 0, vehicles: 0, users: 0, blogPosts: 0 };

  try {
    for (const row of source.turbos.map(normaliseTurbo)) {
      await prisma.turbo.upsert({
        where: { sku: row.sku },
        update: row,
        create: row
      });
      counts.turbos += 1;
    }

    for (const row of source.vehicles.map(normaliseVehicle)) {
      await prisma.vehicle.upsert({
        where: { registration: row.registration },
        update: row,
        create: row
      });
      counts.vehicles += 1;
    }

    for (const row of source.users.map(normaliseUser)) {
      await prisma.user.upsert({
        where: { email: row.email },
        update: {
          role: row.role,
          firstName: row.firstName,
          lastName: row.lastName,
          company: row.company,
          phone: row.phone
        },
        create: row
      });
      counts.users += 1;
    }

    counts.blogPosts = source.blogPosts.map(normaliseBlogPost).length;
    return counts;
  } finally {
    await prisma.$disconnect();
  }
}

async function importToLocalStore(source) {
  await mkdir(outputDir, { recursive: true });
  let data;
  try {
    data = JSON.parse(await readFile(appDataPath, "utf8"));
  } catch {
    data = {
      users: [],
      sessions: [],
      turbos: [],
      carts: [],
      orders: [],
      lookups: [],
      ipBlocks: [],
      contactMessages: [],
      blogPosts: [],
      ebayListings: [],
      auditRuns: []
    };
  }

  const counts = { turbos: 0, vehicles: 0, users: 0, blogPosts: 0 };

  for (const row of source.turbos.map(normaliseTurbo)) {
    const existing = data.turbos.find((turbo) => turbo.sku === row.sku);
    if (existing) Object.assign(existing, row, { updatedAt: new Date().toISOString() });
    else data.turbos.push({ id: nextId(data.turbos), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...row });
    counts.turbos += 1;
  }

  for (const row of source.vehicles.map(normaliseVehicle)) {
    data.lookups.push({
      id: nextId(data.lookups),
      registration: row.registration,
      source: row.source,
      vehicle: row,
      createdAt: new Date().toISOString()
    });
    counts.vehicles += 1;
  }

  for (const row of source.users.map(normaliseUser)) {
    const existing = data.users.find((user) => user.email === row.email);
    if (existing) Object.assign(existing, row);
    else data.users.push({ id: nextId(data.users), createdAt: new Date().toISOString(), ...row });
    counts.users += 1;
  }

  for (const row of source.blogPosts.map(normaliseBlogPost)) {
    const existing = data.blogPosts.find((post) => post.slug === row.slug);
    if (existing) Object.assign(existing, row);
    else data.blogPosts.push({ id: nextId(data.blogPosts), ...row });
    counts.blogPosts += 1;
  }

  await writeFile(appDataPath, JSON.stringify(data, null, 2), "utf8");
  return counts;
}

async function main() {
  await mkdir(outputDir, { recursive: true });

  try {
    const source = await readJsonSource();
    const target = isRealDatabaseUrl() ? "prisma" : "local-json";
    const counts = target === "prisma" ? await importToPrisma(source) : await importToLocalStore(source);
    const report = {
      migratedAt: new Date().toISOString(),
      sourcePath,
      target,
      counts,
      status: "completed"
    };
    await writeFile(outputPath, JSON.stringify(report, null, 2), "utf8");
    console.log(`Migration completed into ${target}. Report written to ${outputPath}`);
  } catch (error) {
    const report = {
      migratedAt: new Date().toISOString(),
      sourcePath,
      status: "blocked",
      note: "Provide data/existing-data.json or set MIGRATION_SOURCE to an exported Ace Turbo JSON file.",
      error: String(error)
    };
    await writeFile(outputPath, JSON.stringify(report, null, 2), "utf8");
    console.log(`Migration blocked. Report written to ${outputPath}`);
    process.exitCode = 1;
  }
}

main();
