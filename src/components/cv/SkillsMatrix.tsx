import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Search, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface Skill {
  skill: string;
  domain: string;
  rating: number;
  "Proficiency Level": string;
  proof: string;
  recency_year: string;
  impact_metric: string;
}

export function SkillsMatrix() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDomain, setFilterDomain] = useState("all");
  const [filterRating, setFilterRating] = useState("0");
  const [sortBy, setSortBy] = useState<"rating" | "recency" | "domain">("rating");

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [skills, searchTerm, filterDomain, filterRating, sortBy]);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from("175+ Skills Matrix")
        .select("*");

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      // Defensive null checks and data validation
      const validatedData = (data || []).map(skill => ({
        ...skill,
        rating: skill.rating ?? 0,
        skill: skill.skill ?? 'Unknown',
        domain: skill.domain ?? 'General',
        "Proficiency Level": skill["Proficiency Level"] ?? 'Intermediate',
        proof: skill.proof ?? '',
        recency_year: skill.recency_year ?? new Date().getFullYear().toString(),
        impact_metric: skill.impact_metric ?? ''
      }));

      setSkills(validatedData);
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error("Failed to load skills matrix. The data may still be syncing.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...skills];

    if (searchTerm) {
      filtered = filtered.filter((s) =>
        s.skill?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDomain !== "all") {
      filtered = filtered.filter((s) => s.domain === filterDomain);
    }

    if (filterRating !== "0") {
      const minRating = parseInt(filterRating);
      filtered = filtered.filter((s) => (s.rating || 0) >= minRating);
    }

    filtered.sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "recency")
        return (b.recency_year || "").localeCompare(a.recency_year || "");
      if (sortBy === "domain") return (a.domain || "").localeCompare(b.domain || "");
      return 0;
    });

    setFilteredSkills(filtered);
  };

  const domains = Array.from(new Set(skills.map((s) => s.domain).filter(Boolean)));

  const exportSkills = async (format: "pdf" | "html" | "csv") => {
    try {
      if (format === "pdf") {
        const [{ jsPDF }, { default: autoTable }, { saveAs }] = await Promise.all([
          import("jspdf"),
          import("jspdf-autotable"),
          import("file-saver")
        ]);
        const doc = new jsPDF({
          format: "a4",
          orientation: "landscape",
          unit: "mm",
        });

        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("Troy Latter - Skills Matrix", 15, 15);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(
          `${filteredSkills.length} Professional Skills | Generated ${new Date().toLocaleDateString()}`,
          15,
          22
        );

        autoTable(doc, {
          startY: 30,
          head: [["Skill", "Domain", "Rating", "Proficiency", "Evidence", "Year"]],
          body: filteredSkills.map((s) => [
            s.skill || "",
            s.domain || "",
            "⭐".repeat(s.rating || 0),
            s["Proficiency Level"] || "",
            (s.proof || "").substring(0, 40) + "...",
            s.recency_year || "",
          ]),
          theme: "grid",
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [37, 99, 235], fontStyle: "bold" },
          alternateRowStyles: { fillColor: [249, 250, 251] },
          margin: { left: 10, right: 10 },
        });

        doc.save(`Skills-Matrix-Troy-Latter-${Date.now()}.pdf`);
        toast.success("PDF exported successfully!");
      } else if (format === "html") {
        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Troy Latter - Skills Matrix</title>
  <style>
    @page { size: A4 landscape; margin: 2cm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', Arial, sans-serif; padding: 40px 20px; background: #f9fafb; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    h1 { color: #2563eb; margin-bottom: 10px; font-size: 28pt; }
    .meta { color: #64748b; margin-bottom: 30px; font-size: 11pt; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #2563eb; color: white; padding: 12px; text-align: left; font-weight: 600; }
    td { padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 10pt; }
    tr:nth-child(even) { background: #f9fafb; }
    .rating { color: #fbbf24; font-size: 14px; }
    .domain-badge { background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 10pt; display: inline-block; }
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; background: white; }
      .container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Troy Latter - Professional Skills Matrix</h1>
    <p class="meta">${filteredSkills.length} Skills | Generated ${new Date().toLocaleDateString()}</p>
    <table>
      <thead>
        <tr>
          <th style="width: 25%">Skill</th>
          <th style="width: 15%">Domain</th>
          <th style="width: 10%">Rating</th>
          <th style="width: 15%">Proficiency</th>
          <th style="width: 25%">Evidence</th>
          <th style="width: 10%">Year</th>
        </tr>
      </thead>
      <tbody>
        ${filteredSkills
          .map(
            (s) => `
          <tr>
            <td><strong>${s.skill || "-"}</strong></td>
            <td><span class="domain-badge">${s.domain || "-"}</span></td>
            <td><span class="rating">${"⭐".repeat(s.rating || 0)}</span></td>
            <td>${s["Proficiency Level"] || "-"}</td>
            <td style="font-size: 9pt; color: #64748b;">${s.proof || "-"}</td>
            <td>${s.recency_year || "-"}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  </div>
</body>
</html>
        `;

        const blob = new Blob([html], { type: "text/html" });
        saveAs(blob, `Skills-Matrix-Troy-Latter-${Date.now()}.html`);
        toast.success("HTML exported successfully!");
      } else if (format === "csv") {
        const headers = [
          "Skill",
          "Domain",
          "Rating",
          "Proficiency Level",
          "Evidence",
          "Year",
          "Impact Metric",
        ];
        const rows = filteredSkills.map((s) => [
          s.skill,
          s.domain,
          s.rating,
          s["Proficiency Level"],
          s.proof,
          s.recency_year,
          s.impact_metric,
        ]);

        const csv = [headers, ...rows]
          .map((row) => row.map((cell) => `"${cell || ""}"`).join(","))
          .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        saveAs(blob, `Skills-Matrix-Troy-Latter-${Date.now()}.csv`);
        toast.success("CSV exported successfully!");
      }
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export skills");
    }
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i <= (rating || 0)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-card p-6 rounded-lg border animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4" />
          <div className="h-4 bg-muted rounded w-2/3 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 bg-muted rounded" />
            ))}
          </div>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">Professional Skills Matrix</h2>
        <p className="text-muted-foreground mb-6">
          Comprehensive skills inventory across {skills.length} professional competencies.
          Filter, sort, and export in multiple formats.
        </p>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={filterDomain} onValueChange={setFilterDomain}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              {domains.map((domain) => (
                <SelectItem key={domain} value={domain}>
                  {domain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger>
              <SelectValue placeholder="Minimum rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Ratings</SelectItem>
              <SelectItem value="5">⭐⭐⭐⭐⭐ (5 stars)</SelectItem>
              <SelectItem value="4">⭐⭐⭐⭐ (4+ stars)</SelectItem>
              <SelectItem value="3">⭐⭐⭐ (3+ stars)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Rating (High to Low)</SelectItem>
              <SelectItem value="recency">Most Recent</SelectItem>
              <SelectItem value="domain">Domain</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2 mb-6">
          <Button onClick={() => exportSkills("pdf")} variant="default" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={() => exportSkills("html")} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export HTML
          </Button>
          <Button onClick={() => exportSkills("csv")} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground mb-4">
          Showing {filteredSkills.length} of {skills.length} skills
        </div>
      </div>

      {/* Skills Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[25%] font-semibold">Skill</TableHead>
              <TableHead className="w-[15%] font-semibold">Domain</TableHead>
              <TableHead className="text-center w-[12%] font-semibold">Rating</TableHead>
              <TableHead className="w-[15%] font-semibold">Proficiency</TableHead>
              <TableHead className="w-[25%] font-semibold">Evidence</TableHead>
              <TableHead className="text-center w-[8%] font-semibold">Year</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSkills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No skills match your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredSkills.map((skill, idx) => (
                <TableRow key={idx} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{skill.skill || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {skill.domain || "-"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <StarRating rating={skill.rating || 0} />
                  </TableCell>
                  <TableCell className="text-sm">
                    {skill["Proficiency Level"] || "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {skill.proof ? (
                      <span className="line-clamp-2">{skill.proof}</span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {skill.recency_year || "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
