import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import mammoth from "mammoth";

const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");
const pdfParse = pdfParseModule.default || pdfParseModule;

const root = process.cwd();
const packsDir = path.join(root, "cv-packs");
const generatedDir = path.join(root, "src/generated");
const publicDir = path.join(root, "public/cv-packs");

fs.mkdirSync(generatedDir, { recursive: true });
fs.mkdirSync(publicDir, { recursive: true });

const SUPPORTED = /\.(docx|pdf|txt|md)$/i;

const slugify = (s) =>
  s.toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const label = (s) =>
  s.replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

function detectType(filename) {
  const n = filename.toLowerCase();
  if (/cover[-_ ]?letter|coverletter/.test(n)) return "cover-letter";
  if (/skills?[-_ ]?(matrix|profile)|skillsmatrix/.test(n)) return "skills-matrix";
  if (/application|selection[-_ ]?criteria|response/.test(n)) return "application";
  if (/portfolio|case[-_ ]?stud/.test(n)) return "portfolio";
  if (/resume|curriculum|(^|[-_ ])cv([-. _]|$)/.test(n)) return "cv";
  return "document";
}

async function extract(file) {
  const ext = path.extname(file).toLowerCase();
  const buffer = fs.readFileSync(file);

  if (ext === ".txt" || ext === ".md") return buffer.toString("utf8");
  if (ext === ".docx") return (await mammoth.extractRawText({ buffer })).value;
  if (ext === ".pdf") return (await pdfParse(buffer)).text;
  throw new Error(`Unsupported CV source: ${file}`);
}

function cleanDir(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

const packDirs = fs.existsSync(packsDir)
  ? fs.readdirSync(packsDir, { withFileTypes: true })
      .filter((x) => x.isDirectory() && !x.name.startsWith("_"))
      .map((x) => x.name)
      .sort()
  : [];

const routes = [];

for (const slug of packDirs) {
  const dir = path.join(packsDir, slug);
  const manifestPath = path.join(dir, "manifest.json");
  const manifest = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
    : {};

  const sourceFiles = fs.readdirSync(dir)
    .filter((f) => SUPPORTED.test(f))
    .sort();

  if (!sourceFiles.length) continue;

  const artifacts = [];
  const outDir = path.join(publicDir, slug);
  cleanDir(outDir);

  for (const source of sourceFiles) {
    const sourcePath = path.join(dir, source);
    const type = manifest.artifacts?.[source]?.type || detectType(source);
    const text = await extract(sourcePath);
    const artifactSlug = slugify(source);
    const publicSource = `${artifactSlug}${path.extname(source).toLowerCase()}`;

    fs.copyFileSync(sourcePath, path.join(outDir, publicSource));

    artifacts.push({
      filename: source,
      slug: artifactSlug,
      type,
      title: manifest.artifacts?.[source]?.title || label(path.basename(source, path.extname(source))),
      text,
      download: `/cv-packs/${slug}/${publicSource}`
    });
  }

  const title = manifest.title || label(slug);
  const description = manifest.description || `${artifacts.length} document${artifacts.length === 1 ? "" : "s"} in this application pack.`;
  const role = manifest.role || "";
  const company = manifest.company || "";

  fs.writeFileSync(
    path.join(outDir, "content.json"),
    JSON.stringify({ slug, title, description, role, company, artifacts, generatedAt: new Date().toISOString() }, null, 2) + "\n"
  );

  routes.push({ slug, title, description, role, company, artifactCount: artifacts.length });
}

const generatedRoutes = `// AUTO-GENERATED. DO NOT EDIT.
import { lazy } from "react";

export const generatedCvRoutes = ${JSON.stringify(routes, null, 2)}.map((item) => ({
  ...item,
  Component: lazy(() => import("./GeneratedCVPage"))
}));
`;

fs.writeFileSync(path.join(generatedDir, "cvRoutes.ts"), generatedRoutes);

const page = `import { useEffect, useState } from "react";

type Artifact = {
  filename: string;
  title: string;
  type: string;
  text: string;
  download: string;
};

type Pack = {
  title: string;
  description: string;
  role?: string;
  company?: string;
  artifacts: Artifact[];
};

const typeLabel: Record<string, string> = {
  "cv": "CV",
  "cover-letter": "Cover Letter",
  "skills-matrix": "Skills Matrix",
  "application": "Application",
  "portfolio": "Portfolio",
  "document": "Document"
};

export default function GeneratedCVPage({ slug }: { slug: string }) {
  const [data, setData] = useState<Pack | null>(null);

  useEffect(() => {
    fetch("/cv-packs/" + slug + "/content.json")
      .then((r) => r.json())
      .then(setData);
  }, [slug]);

  if (!data) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  return (
    <main className="container mx-auto px-6 py-12 max-w-6xl">
      <header className="mb-10">
        <a href="/cv/" className="text-sm opacity-60 hover:opacity-100">← All CV packs</a>
        <h1 className="text-4xl font-bold mt-4">{data.title}</h1>
        {(data.role || data.company) && (
          <p className="mt-2 text-lg opacity-70">{[data.role, data.company].filter(Boolean).join(" · ")}</p>
        )}
        <p className="mt-3 opacity-70">{data.description}</p>
      </header>

      <div className="space-y-8">
        {data.artifacts.map((artifact) => (
          <section key={artifact.filename} className="rounded-xl border p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <p className="text-xs uppercase tracking-wide opacity-60">{typeLabel[artifact.type] || artifact.type}</p>
                <h2 className="text-2xl font-semibold mt-1">{artifact.title}</h2>
              </div>
              <a className="text-sm underline" href={artifact.download} download>Download original</a>
            </div>
            <article className="whitespace-pre-wrap leading-7">{artifact.text}</article>
          </section>
        ))}
      </div>
    </main>
  );
}
`;

fs.writeFileSync(path.join(generatedDir, "GeneratedCVPage.tsx"), page);

const indexPage = `import { Link } from "react-router-dom";
import { generatedCvRoutes } from "./cvRoutes";

export default function GeneratedCVIndexPage() {
  return (
    <main className="container mx-auto px-6 py-12 max-w-6xl">
      <header className="mb-10">
        <p className="text-sm uppercase tracking-wide opacity-60">CV & Application Packs</p>
        <h1 className="text-4xl font-bold mt-2">Troy Latter</h1>
        <p className="mt-3 opacity-70">Current CVs, cover letters, skills matrices and application material.</p>
      </header>

      {!generatedCvRoutes.length ? (
        <div className="rounded-xl border p-8 opacity-70">
          No CV packs have been published yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {generatedCvRoutes.map((pack) => (
            <Link key={pack.slug} to={`/cv/${pack.slug}/`} className="rounded-xl border p-6 hover:shadow-md transition-shadow">
              <p className="text-xs uppercase tracking-wide opacity-60">
                {pack.artifactCount} document{pack.artifactCount === 1 ? "" : "s"}
              </p>
              <h2 className="text-2xl font-semibold mt-2">{pack.title}</h2>
              {(pack.role || pack.company) && (
                <p className="mt-2 opacity-70">{[pack.role, pack.company].filter(Boolean).join(" · ")}</p>
              )}
              <p className="mt-3 opacity-70">{pack.description}</p>
              <span className="inline-block mt-5 text-sm underline">Open pack →</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
`;

fs.writeFileSync(path.join(generatedDir, "GeneratedCVIndexPage.tsx"), indexPage);

console.log(`CV HARNESS: discovered ${routes.length} pack(s): ${routes.map((r) => r.slug).join(", ") || "none"}`);
