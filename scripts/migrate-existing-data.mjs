import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const cwd = process.cwd();
const sourcePath = path.join(cwd, "data", "existing-data.json");
const outputDir = path.join(cwd, ".data");
const outputPath = path.join(outputDir, "migration-report.json");

async function main() {
  await mkdir(outputDir, { recursive: true });

  try {
    const raw = await readFile(sourcePath, "utf8");
    const parsed = JSON.parse(raw);
    const report = {
      migratedAt: new Date().toISOString(),
      sourcePath,
      recordCounts: {
        turbos: Array.isArray(parsed.turbos) ? parsed.turbos.length : 0,
        vehicles: Array.isArray(parsed.vehicles) ? parsed.vehicles.length : 0,
        users: Array.isArray(parsed.users) ? parsed.users.length : 0
      },
      note: "Map these source records into Prisma or the local JSON store before production cutover."
    };
    await writeFile(outputPath, JSON.stringify(report, null, 2), "utf8");
    console.log(`Migration report written to ${outputPath}`);
  } catch (error) {
    const report = {
      migratedAt: new Date().toISOString(),
      sourcePath,
      status: "blocked",
      note: "No existing-data.json source file found. Provide exported Ace Turbo data before running production migration.",
      error: String(error)
    };
    await writeFile(outputPath, JSON.stringify(report, null, 2), "utf8");
    console.log(`Migration blocked. Report written to ${outputPath}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
