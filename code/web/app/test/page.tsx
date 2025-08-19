"use client";

import React from "react";

export default function GuidebookPage() {
  const handleDownload = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/guidebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kelurahan: "Duren Sawit",
          width_m: 2.5,
          length_m: 120,
          project_name: "BedahGang – Paket 1",
          // optional overrides:
          // unit_cost_paving_idr_m2: 375000,
          // unit_cost_drain_clean_idr_m: 60000,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "Guidebook.pdf";
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download guidebook");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Download Your Guidebook</h1>
      <button
        onClick={handleDownload}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Generate & Download PDF
      </button>
    </div>
  );
}
