#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-https://troy-latter-psi-iota.vercel.app}"
POLICY="scripts/cv-harness/release-policy.json"

node - "$BASE_URL" "$POLICY" <<'NODE'
const fs = require("fs");
const { execFileSync } = require("child_process");

const base = process.argv[2].replace(/\/$/, "");
const policy = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));

for (const route of policy.routes) {
  const url = base + route;
  const code = execFileSync(
    "curl",
    ["-Ls", "-o", "/dev/null", "-w", "%{http_code}", url],
    { encoding: "utf8" }
  ).trim();

  console.log(`${code === "200" ? "PASS" : "FAIL"} ${code} ${route}`);

  if (code !== "200") process.exitCode = 1;
}
NODE
