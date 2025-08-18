"use client";

import { useMemo, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

type Permukaan = "beton" | "aspal" | "tanah";
type Drainase = "ada" | "tidak ada";

const LEBAR_OPTS = [1, 1.5, 2, 2.5] as const;
const AKTIVITAS = [
  "sosial",
  "komersial",
  "anak",
  "kendaraan",
  "orang",
  "campuran",
] as const;

export default function DimensiGangPage() {
  const router = useRouter();

  // Dummy address (replace with real state/params)
  const alamat1 = "Jl. Melati No. 80";
  const alamat2 = "Kelurahan, Kecamatan";
  const alamat3 = "Kabupaten/Kota";

  const [lebarIdx, setLebarIdx] = useState(0); // 0..3
  const [permukaan, setPermukaan] = useState<Permukaan>("beton");
  const [drainase, setDrainase] = useState<Drainase>("tidak ada");
  const [aktivitas, setAktivitas] = useState<Set<string>>(new Set());

  const lebarLabel = useMemo(
    () => `${LEBAR_OPTS[lebarIdx].toFixed(1)} m`,
    [lebarIdx]
  );

  function changeLebar(delta: number) {
    setLebarIdx((i) =>
      Math.min(Math.max(i + delta, 0), LEBAR_OPTS.length - 1)
    );
  }

  function toggleAkt(k: string) {
    setAktivitas((prev) => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      lebar: LEBAR_OPTS[lebarIdx],
      permukaan,
      drainase,
      aktivitas: Array.from(aktivitas),
    };
    console.log("Konfirmasi Dimensi Gang ->", payload);
    // TODO: send to API / navigate next
  }

  return (
    <div className="min-h-dvh bg-[#2E4270] text-slate-900">
      <div className="mx-auto max-w-[420px] px-4 py-6">
        <div className="rounded-2xl bg-[#FBFCF9] shadow-xl ring-1 ring-black/5">
          {/* Header */}
          <div className="rounded-t-2xl bg-[#2E4270] px-6 pt-6 pb-5 text-center">
            <h1 className="text-xl font-semibold tracking-wide text-white">
              Bedah<span className="font-bold">Gang</span>
            </h1>

            {/* Stepper (Step 2 active) */}
            <ol className="mt-5 flex items-center justify-center gap-3 text-xs text-slate-200">
              <li className="flex flex-col items-center opacity-90">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white/30 text-white ring-2 ring-white/40">
                  1
                </span>
                <span className="mt-1 font-medium text-white/90">Step 1</span>
                <span className="text-[10px] opacity-80">Alamat</span>
              </li>
              <span className="h-0.5 w-24 rounded-full bg-white/80" />
              <li className="flex flex-col items-center">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[#2E4270] ring-2 ring-white">
                  2
                </span>
                <span className="mt-1 font-medium text-white">Step 2</span>
                <span className="text-[10px] opacity-80">Dimensi Gang</span>
              </li>
            </ol>
          </div>

          {/* Body */}
          <form onSubmit={onSubmit} className="px-5 pb-6 pt-5">
            {/* Address pill with Edit */}
            <div className="flex items-start justify-between rounded-xl bg-[#3A54A0] px-4 py-3 text-white shadow-sm">
              <div className="text-left">
                <div className="text-sm font-semibold leading-tight">
                  {alamat1}
                </div>
                <div className="text-xs opacity-90">
                  {alamat2}
                  <br />
                  {alamat3}
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.push("/input-alamat")}
                className="ml-3 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-[#2E4270] hover:bg-white"
              >
                Edit
              </button>
            </div>

            {/* Card area */}
            <div className="mt-4 rounded-2xl bg-[#FBFCF9]">
              {/* Lebar Gang */}
              <label className="mt-3 block text-sm font-medium text-[#2E4270]">
                Lebar Gang
              </label>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => changeLebar(-1)}
                  aria-label="Kurangi lebar"
                  disabled={lebarIdx === 0}
                  className="grid h-8 w-8 place-items-center rounded-full border border-[#2E4270]/40 bg-white text-lg leading-none text-[#2E4270] disabled:opacity-40"
                >
                  –
                </button>

                <div className="flex-1 rounded-full border border-[#2E4270]/40 bg-white px-5 py-2 text-center text-sm font-medium text-slate-700">
                  {lebarLabel}
                </div>

                <button
                  type="button"
                  onClick={() => changeLebar(1)}
                  aria-label="Tambah lebar"
                  disabled={lebarIdx === LEBAR_OPTS.length - 1}
                  className="grid h-8 w-8 place-items-center rounded-full border border-[#2E4270]/40 bg-white text-lg leading-none text-[#2E4270] disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {/* Permukaan Jalan */}
              <SelectField
                className="mt-5"
                label="Permukaan Jalan"
                value={permukaan}
                onChange={(v) => setPermukaan(v as Permukaan)}
                options={[
                  { label: "Beton", value: "beton" },
                  { label: "Aspal", value: "aspal" },
                  { label: "Tanah", value: "tanah" },
                ]}
              />

              {/* Drainase */}
              <SelectField
                className="mt-4"
                label="Drainase"
                value={drainase}
                onChange={(v) => setDrainase(v as Drainase)}
                options={[
                  { label: "Ada", value: "ada" },
                  { label: "Tidak ada", value: "tidak ada" },
                ]}
              />

              {/* Aktivitas */}
              <div className="mt-5">
                <div className="text-sm font-medium text-[#2E4270]">
                  Aktivitas
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {AKTIVITAS.map((k) => {
                    const active = aktivitas.has(k);
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => toggleAkt(k)}
                        className={[
                          "h-20 rounded-xl border text-xs capitalize transition",
                          active
                            ? "border-[#3A54A0] bg-[#3A54A0]/10 font-semibold text-[#2E4270]"
                            : "border-slate-300 bg-slate-200 text-slate-600",
                        ].join(" ")}
                        aria-pressed={active}
                      >
                        {k}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-[#3A54A0] px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#344C90] active:scale-[0.99]"
            >
              Konfirmasi Dimensi Gang
            </button>
          </form>

          <div className="h-3 rounded-b-2xl bg-[#FBFCF9]" />
        </div>
      </div>
    </div>
  );
}

function SelectField(props: {
  className?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  const id = props.label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={props.className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-[#2E4270]">
        {props.label}
      </label>

      <div className="relative">
        <select
          id={id}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          className="w-full appearance-none rounded-full border border-[#2E4270]/40 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 outline-none focus:border-[#2E4270] focus:ring-2 focus:ring-[#2E4270]/30"
        >
          {props.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {/* Chevron */}
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 opacity-70"
        >
          <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
