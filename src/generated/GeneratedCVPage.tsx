import { useEffect, useState } from "react";

type Artifact = { filename: string; title: string; type: string; text: string; download: string };
type Pack = { title: string; description: string; role?: string; company?: string; artifacts: Artifact[] };

const typeLabel: Record<string, string> = {
  cv: "CV", "cover-letter": "Cover Letter", "skills-matrix": "Skills Matrix",
  application: "Application", portfolio: "Portfolio", document: "Document"
};

export default function GeneratedCVPage({ slug }: { slug: string }) {
  const [data, setData] = useState<Pack | null>(null);
  useEffect(() => { fetch("/cv-packs/" + slug + "/content.json").then((r) => r.json()).then(setData); }, [slug]);
  if (!data) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  return (
    <main className="container mx-auto px-6 py-12 max-w-6xl">
      <header className="mb-10">
        <a href="/cv/" className="text-sm opacity-60 hover:opacity-100">← All CV packs</a>
        <h1 className="text-4xl font-bold mt-4">{data.title}</h1>
        {(data.role || data.company) && <p className="mt-2 text-lg opacity-70">{[data.role, data.company].filter(Boolean).join(" · ")}</p>}
        <p className="mt-3 opacity-70">{data.description}</p>
      </header>
      <div className="space-y-8">
        {data.artifacts.map((artifact) => (
          <section key={artifact.filename} className="rounded-xl border p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div><p className="text-xs uppercase tracking-wide opacity-60">{typeLabel[artifact.type] || artifact.type}</p><h2 className="text-2xl font-semibold mt-1">{artifact.title}</h2></div>
              <a className="text-sm underline" href={artifact.download} download>Download original</a>
            </div>
            <article className="whitespace-pre-wrap leading-7">{artifact.text}</article>
          </section>
        ))}
      </div>
    </main>
  );
}
