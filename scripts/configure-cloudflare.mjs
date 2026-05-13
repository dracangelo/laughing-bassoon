const token = process.env.CF_API_TOKEN;
const zoneId = process.env.CF_ZONE_ID;

async function cf(path, init = {}) {
  if (!token || !zoneId) {
    throw new Error("CF_API_TOKEN and CF_ZONE_ID are required.");
  }

  const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {})
    }
  });
  const body = await response.json();
  if (!response.ok || body.success === false) {
    throw new Error(JSON.stringify(body));
  }
  return body;
}

async function main() {
  const settings = [
    ["/settings/always_use_https", { value: "on" }],
    ["/settings/automatic_https_rewrites", { value: "on" }],
    ["/settings/min_tls_version", { value: "1.2" }],
    ["/settings/security_level", { value: "medium" }],
    ["/settings/browser_check", { value: "on" }]
  ];

  const results = [];
  for (const [path, body] of settings) {
    results.push(await cf(path, { method: "PATCH", body: JSON.stringify(body) }));
  }

  console.log(JSON.stringify({ configuredAt: new Date().toISOString(), settings: results.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
