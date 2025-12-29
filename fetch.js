// scripts/fetch.js
// Node 20+ (GitHub Actions hỗ trợ)
// Dùng API hợp pháp / API nội bộ của bạn.

const fs = require("fs");
const path = require("path");

const API_URL = process.env.API_URL;     // đặt trong GitHub Secrets/Vars
const API_TOKEN = process.env.API_TOKEN; // optional

if (!API_URL) {
  console.error("Missing API_URL env");
  process.exit(1);
}

async function main() {
  const headers = {
    "User-Agent": "github-actions-fetcher/1.0",
    "Accept": "application/json",
  };

  // Nếu API cần token thì dùng Bearer (tuỳ API bạn đổi cho đúng)
  if (API_TOKEN) headers["Authorization"] = `Bearer ${API_TOKEN}`;

  const res = await fetch(API_URL, { headers, cache: "no-store" });
  const text = await res.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    // Nếu API không phải JSON, vẫn lưu raw
    json = { raw: text };
  }

  const out = {
    fetched_at_utc: new Date().toISOString(),
    source: API_URL,
    data: json,
  };

  const outPath = path.join(process.cwd(), "data.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf-8");

  console.log("Wrote data.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
