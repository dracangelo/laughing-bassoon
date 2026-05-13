import { mkdir, writeFile } from "fs/promises";
import path from "path";

const target = process.env.AUDIT_TARGET_URL || process.env.NEXTAUTH_URL || "https://aceturbo.co.uk";
const outputDir = path.join(process.cwd(), ".data");
const outputPath = path.join(outputDir, "security-audit-report.json");

async function fetchJsonOrText(url) {
  const response = await fetch(url, { headers: { "user-agent": "AceTurboAudit/1.0" } });
  const text = await response.text();
  try {
    return { ok: response.ok, status: response.status, body: JSON.parse(text) };
  } catch {
    return { ok: response.ok, status: response.status, body: text.slice(0, 4000) };
  }
}

async function main() {
  await mkdir(outputDir, { recursive: true });

  const checks = [];
  const urls = [
    {
      provider: "SecurityHeaders",
      url: `https://securityheaders.com/?q=${encodeURIComponent(target)}&followRedirects=on`
    },
    {
      provider: "Mozilla Observatory",
      url: `https://http-observatory.security.mozilla.org/api/v1/analyze?host=${encodeURIComponent(new URL(target).host)}`
    }
  ];

  for (const check of urls) {
    try {
      checks.push({ provider: check.provider, ...(await fetchJsonOrText(check.url)) });
    } catch (error) {
      checks.push({ provider: check.provider, ok: false, error: String(error) });
    }
  }

  const report = {
    target,
    ranAt: new Date().toISOString(),
    status: checks.every((check) => check.ok) ? "completed" : "completed_with_errors",
    checks,
    manualFollowUp: [
      "Run authenticated Pentest Tools or Sucuri scans from their dashboards before launch.",
      "Attach the exported PDF reports to the launch checklist.",
      "Re-run after DNS, Cloudflare WAF, Stripe webhooks and production env vars are live."
    ]
  };

  await writeFile(outputPath, JSON.stringify(report, null, 2), "utf8");
  console.log(`Security audit report written to ${outputPath}`);
}

main().catch(async (error) => {
  await mkdir(outputDir, { recursive: true });
  await writeFile(
    outputPath,
    JSON.stringify({ target, ranAt: new Date().toISOString(), status: "failed", error: String(error) }, null, 2),
    "utf8"
  );
  console.error(error);
  process.exit(1);
});
