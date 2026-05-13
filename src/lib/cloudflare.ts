import axios from "axios";

export async function syncCloudflareIpBlock(ipAddress: string, note: string) {
  if (!process.env.CF_API_TOKEN || !process.env.CF_ZONE_ID) {
    return { skipped: true };
  }

  return axios.post(
    `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE_ID}/firewall/access_rules/rules`,
    {
      mode: "block",
      configuration: { target: "ip", value: ipAddress },
      notes: note
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
}
