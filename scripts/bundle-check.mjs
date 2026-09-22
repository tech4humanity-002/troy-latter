import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist/assets");
const policy = JSON.parse(
  fs.readFileSync("scripts/cv-harness/release-policy.json", "utf8")
);

const js = fs.readdirSync(dist)
  .filter((f) => f.endsWith(".js"))
  .map((f) => ({
    file: f,
    kb: fs.statSync(path.join(dist, f)).size / 1024
  }))
  .sort((a, b) => b.kb - a.kb);

const largest = js[0];

console.log("=== BUNDLE GATE ===");
console.log(`largest JS: ${largest?.file || "none"} ${largest?.kb.toFixed(1)} KB`);

if (largest && largest.kb > policy.bundle.maxChunkKb) {
  console.error(
    `BLOCKED: chunk ${largest.file} exceeds ${policy.bundle.maxChunkKb} KB`
  );
  process.exit(1);
}

const entryCandidates = js.filter((x) => /^index\.[^.]+\.js$/.test(x.file));
const entry = entryCandidates[0];

if (entry && entry.kb > policy.bundle.maxEntryKb) {
  console.error(
    `BLOCKED: entry ${entry.file} exceeds ${policy.bundle.maxEntryKb} KB`
  );
  process.exit(1);
}

console.log("BUNDLE GATE: PASS");
