"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function AddressPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    alamat: "",
    kelurahan: "",
    kecamatan: "",
    kabupatenKota: "",
  });

  function onChange<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: handle submit (send to API / route to Step 2)
    console.log("Konfirmasi Alamat ->", form);
  }

  return (
    <div className="min-h-dvh bg-[#2E4270] text-slate-900">
      {/* Mobile container */}
      <div className="mx-auto max-w-[420px] px-4 py-6">
        {/* Card */}
        <div className="rounded-2xl bg-[#FBFCF9] shadow-xl ring-1 ring-black/5">
          {/* Header */}
          <div className="rounded-t-2xl bg-[#2E4270] px-6 pt-6 pb-5 text-center">
            <h1 className="text-xl font-semibold tracking-wide text-white">
              Bedah<span className="font-bold">Gang</span>
            </h1>

            {/* Stepper */}
            <ol className="mt-5 flex items-center justify-center gap-3 text-xs text-slate-200">
              {/* Step 1 (active) */}
              <li className="flex flex-col items-center">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[#2E4270] ring-2 ring-white">
                  1
                </span>
                <span className="mt-1 font-medium text-white">Step 1</span>
                <span className="text-[10px] opacity-80">Alamat</span>
              </li>

              {/* Connector */}
              <span className="h-0.5 w-24 rounded-full bg-white/80" />

              {/* Step 2 (inactive) */}
              <li className="flex flex-col items-center opacity-80">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white/30 text-white ring-2 ring-white/40">
                  2
                </span>
                <span className="mt-1 font-medium text-white/90">Step 2</span>
                <span className="text-[10px] opacity-80">Dimensi Gang</span>
              </li>
            </ol>
          </div>

          {/* Body */}
          <form onSubmit={onSubmit} className="px-5 pb-6 pt-5">
            {/* Map container (replace with your map library) */}
            <div className="rounded-2xl border border-slate-200 bg-slate-200/60 p-3">
              <div
                id="map-container"
                role="application"
                aria-label="Map placeholder"
                className="grid h-56 w-full place-items-center rounded-xl border-2 border-dashed border-slate-300 text-slate-600"
              >
                map
              </div>
              {/* Put your map component inside #map-container (Leaflet, Google Maps, Mapbox, etc.) */}
            </div>

            {/* Inputs */}
            <div className="mt-5 space-y-4">
              <Field
                label="Alamat"
                placeholder="Jl. Melati No. 80"
                value={form.alamat}
                onChange={(v) => onChange("alamat", v)}
              />
              <Field
                label="Kelurahan"
                placeholder="Kelurahan"
                value={form.kelurahan}
                onChange={(v) => onChange("kelurahan", v)}
              />
              <Field
                label="Kecamatan"
                placeholder="Kecamatan"
                value={form.kecamatan}
                onChange={(v) => onChange("kecamatan", v)}
              />
              <Field
                label="Kabupaten/Kota"
                placeholder="Kota Kabupaten"
                value={form.kabupatenKota}
                onChange={(v) => onChange("kabupatenKota", v)}
              />
            </div>

            {/* CTA */}
            <div className="mt-6">
              <button
                type="submit"
                className="mx-auto block w-full rounded-full bg-[#3A54A0] px-5 py-3 text-center text-sm font-semibold text-white shadow transition active:scale-[0.99] hover:bg-[#344C90]"
                onClick={() => router.push("/input-dimensi-gang")}
              >
                Konfirmasi Alamat
              </button>
            </div>
          </form>

          {/* Bottom radius spacer to match mockup */}
          <div className="h-3 rounded-b-2xl bg-[#FBFCF9]" />
        </div>
      </div>
    </div>
  );
}

/** Reusable input field */
function Field(props: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const { label, placeholder, value, onChange } = props;
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label htmlFor={id} className="block">
      <div className="mb-1 text-sm font-medium text-[#2E4270]">{label}</div>
      <input
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-[#2E4270]/40 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-[#2E4270] focus:ring-2 focus:ring-[#2E4270]/30"
        autoComplete="off"
        inputMode="text"
      />
    </label>
  );
}
