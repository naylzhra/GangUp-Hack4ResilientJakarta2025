import { useEffect, useMemo, useState } from "react";

export function normalizeKey(s: string) {
  return s.toLowerCase().replace(/\s+/g, "");
}

type CsvRow = { kota: string; kecamatan: string; kelurahan: string };

export function parseCSV(csv: string): CsvRow[] {
  const lines = csv.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const rawHeaders = lines[0].split(",").map((h) => h.trim());
  const headers = rawHeaders.map(normalizeKey);

  const idxKota = headers.findIndex((h) => /kabupatenkota|kotakabupaten|kota|kabupaten/.test(h));
  const idxKec = headers.findIndex((h) => /kecamatan/.test(h));
  const idxKel = headers.findIndex((h) => /kelurahan|desa/.test(h));

  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim());
    const kota = (cols[idxKota] || "").trim();
    const kecamatan = (cols[idxKec] || "").trim();
    const kelurahan = (cols[idxKel] || "").trim();
    if (kota && kecamatan && kelurahan) {
      rows.push({ kota, kecamatan, kelurahan });
    }
  }
  return rows;
}

export function unique(arr: string[]) {
  return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b, "id"));
}

export function useDkiOptions() {
  const [all, setAll] = useState<CsvRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/data/dki.csv", { cache: "force-cache" })
      .then((r) => {
        if (!r.ok) throw new Error(`Gagal mengambil CSV (${r.status})`);
        return r.text();
      })
      .then((txt) => {
        if (!alive) return;
        setAll(parseCSV(txt));
      })
      .catch((e) => {
        if (!alive) return;
        setError(String(e.message || e));
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const kotaList = useMemo(() => unique(all.map((r) => r.kota)), [all]);

  function kecamatanList(kota?: string) {
    if (!kota) return [];
    return unique(all.filter((r) => r.kota === kota).map((r) => r.kecamatan));
  }

  function kelurahanList(kota?: string, kecamatan?: string) {
    if (!kota || !kecamatan) return [];
    return unique(
      all
        .filter((r) => r.kota === kota && r.kecamatan === kecamatan)
        .map((r) => r.kelurahan)
    );
  }

  return { loading, error, kotaList, kecamatanList, kelurahanList };
}
