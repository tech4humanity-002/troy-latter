import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");

const run = (command, args) => {
  console.log(`> ${command} ${args.join(" ")}`);
  execFileSync(command, args, { cwd: root, stdio: "inherit" });
};

const copyDir = (source, destination) => {
  const sourcePath = path.join(root, source);
  const destinationPath = path.join(dist, destination);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Build input is missing: ${source}`);
  }
  fs.rmSync(destinationPath, { recursive: true, force: true });
  fs.cpSync(sourcePath, destinationPath, { recursive: true });
};

run("npx", ["vite", "build"]);

for (const name of ["LAB3", "Infosys", "TCS", "ey-parthenon", "ey-defence-1744589"]) {
  copyDir(name, name);
}

copyDir("good-things", "good-things");

const requiredHighlandFiles = [
  "highland-property/index.html",
  "highland-property/cv.html",
  "highland-property/cover-letter.html",
  "highland-property/evidence.html",
];

for (const relativePath of requiredHighlandFiles) {
  const target = path.join(dist, relativePath);
  if (!fs.existsSync(target)) {
    throw new Error(`Highland application asset missing from build output: ${relativePath}`);
  }
}

console.log("Build output verified:");
console.log(`- ${requiredHighlandFiles.length} Highland application pages present`);
console.log("- application packages copied");
console.log("- good-things package copied");
