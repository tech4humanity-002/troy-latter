#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

mkdir -p release/receipts

echo "=== T4H RELEASE HARNESS ==="
echo "SOURCE"
git status --short
git rev-parse --short HEAD

echo "=== CV PACK DISCOVERY ==="
node scripts/cv-harness/build-cv-packs.mjs

echo "=== BUILD ==="
rm -rf dist
npm run build

echo "=== BUNDLE ==="
node scripts/bundle-check.mjs

echo "=== DEPLOY ==="
DEPLOY_OUTPUT="$(vercel --prod 2>&1)"
printf '%s\n' "$DEPLOY_OUTPUT"

DEPLOY_URL="$(printf '%s\n' "$DEPLOY_OUTPUT" | grep -Eo 'https://[^[:space:]]+vercel\.app' | tail -1 || true)"
LIVE_URL="https://troy-latter-psi-iota.vercel.app"

echo "=== ROUTES ==="
scripts/route-check.sh "$LIVE_URL"

COMMIT="$(git rev-parse HEAD)"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
RECEIPT="release/receipts/release-${STAMP}.json"

node - "$RECEIPT" "$COMMIT" "$DEPLOY_URL" "$LIVE_URL" <<'NODE'
const fs = require("fs");
const [file, commit, deployment, live] = process.argv.slice(2);

const receipt = {
  result: "REAL",
  generatedAt: new Date().toISOString(),
  commit,
  deployment,
  productionAlias: live,
  bundleGate: "PASS",
  routeGate: "PASS"
};

fs.writeFileSync(file, JSON.stringify(receipt, null, 2) + "\n");
console.log(`RECEIPT ${file}`);
NODE

echo "=== RELEASE COMPLETE ==="
