"use client";

import React, { useCallback, useMemo, useState } from "react";

/**
 * Optional: read saved inputs from sessionStorage if your input page stored them
 * under "bedahGang.input" and "bedahGang.design".
 */
function useSavedInputs() {
  return useMemo(() => {
    try {
      const raw = sessionStorage.getItem("bedahGang.input");
      const designRaw = sessionStorage.getItem("bedahGang.design");
      const input = raw ? JSON.parse(raw) : null; // { alamat:{}, lebar, drainase, permukaan, aktivitas, panjang? }
      const design = designRaw ? JSON.parse(designRaw) : null; // { designModule?: number }

      const width_m = typeof input?.lebar === "number" ? input.lebar : 2.5;
      // if you also saved length on input-page, use it; else default:
      const length_m =
        typeof input?.panjang === "number" ? input.panjang : 120;

      const kelurahan =
        input?.alamat?.kelurahan && String(input.alamat.kelurahan).trim()
          ? input.alamat.kelurahan
          : "Duren Sawit";

      const moduleNum =
        typeof design?.designModule === "number" ? design.designModule : 1;

      return { width_m, length_m, kelurahan, moduleNum };
    } catch {
      return { width_m: 2, length_m: 10, kelurahan: "Duren Sawit", moduleNum: 1 };
    }
  }, []);
}

export default function GuidebookPage() {
  const { width_m, length_m, kelurahan, moduleNum } = useSavedInputs();
  const [downloading, setDownloading] = useState(false);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      // Prepare both requests
      const guidebookReq = fetch(`/api/guidebook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kelurahan,
          width_m,
          length_m,
          project_name: "BedahGang – Paket 1",
          // optional overrides:
          // unit_cost_paving_idr_m2: 375000,
          // unit_cost_drain_clean_idr_m: 60000,
        }),
      });

      const rabReq = fetch(`/api/rab`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleNum,          // e.g. from your design selection
          lebar: width_m,     // use the same width as guidebook
          panjang: length_m,
        }),
      });

      // Run in parallel
      const [guidebookRes, rabRes] = await Promise.all([guidebookReq, rabReq]);

      if (!guidebookRes.ok) {
        const msg = await guidebookRes.text();
        throw new Error(`Guidebook failed: ${guidebookRes.status} ${msg}`);
      }
      if (!rabRes.ok) {
        const msg = await rabRes.text();
        throw new Error(`RAB failed: ${rabRes.status} ${msg}`);
      }

      // Download both PDFs
      const [guidebookBlob, rabBlob] = await Promise.all([
        guidebookRes.blob(),
        rabRes.blob(),
      ]);

      const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      downloadBlob(
        guidebookBlob,
        `Guidebook_${kelurahan.replace(/\s+/g, "_")}_${dateTag}.pdf`
      );
      downloadBlob(
        rabBlob,
        `RAB_${kelurahan.replace(/\s+/g, "_")}_${dateTag}.pdf`
      );
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Gagal mengunduh berkas");
    } finally {
      setDownloading(false);
    }
  }, [downloading, kelurahan, width_m, length_m, moduleNum]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <h1 className="mb-2 text-center text-2xl font-bold">
          Unduh Guidebook & RAB
        </h1>
        <p className="mb-4 text-center text-sm text-gray-600">
          Kelurahan: <b>{kelurahan}</b> • Lebar: <b>{width_m} m</b> • Panjang:{" "}
          <b>{length_m} m</b> • Modul: <b>{moduleNum}</b>
        </p>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-blue-700 disabled:opacity-60"
        >
          {downloading ? "Menyiapkan berkas…" : "Generate & Download PDF"}
        </button>

        <p className="mt-4 text-center text-xs text-gray-500">
          Pastikan backend menyediakan endpoint <code>/api/guidebook</code> dan{" "}
          <code>/api/rab</code> yang mengembalikan PDF.
        </p>
      </div>
    </div>
  );
}
