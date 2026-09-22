import { Link } from "react-router-dom";
import { generatedCvRoutes } from "./cvRoutes";

export default function GeneratedCVIndexPage() {
  return (
    <main className="container mx-auto px-6 py-12 max-w-6xl">
      <header className="mb-10">
        <p className="text-sm uppercase tracking-wide opacity-60">CV & Application Packs</p>
        <h1 className="text-4xl font-bold mt-2">Troy Latter</h1>
        <p className="mt-3 opacity-70">Current CVs, cover letters, skills matrices and application material.</p>
      </header>
      {!generatedCvRoutes.length ? <div className="rounded-xl border p-8 opacity-70">No CV packs have been published yet.</div> : (
        <div className="grid gap-6 md:grid-cols-2">
          {generatedCvRoutes.map((pack) => (
            <Link key={pack.slug} to={`/cv/${pack.slug}/`} className="rounded-xl border p-6 hover:shadow-md transition-shadow">
              <p className="text-xs uppercase tracking-wide opacity-60">{pack.artifactCount} document{pack.artifactCount === 1 ? "" : "s"}</p>
              <h2 className="text-2xl font-semibold mt-2">{pack.title}</h2>
              {(pack.role || pack.company) && <p className="mt-2 opacity-70">{[pack.role, pack.company].filter(Boolean).join(" · ")}</p>}
              <p className="mt-3 opacity-70">{pack.description}</p>
              <span className="inline-block mt-5 text-sm underline">Open pack →</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
