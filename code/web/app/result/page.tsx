"use client";

import { useState } from "react";

export default function HasilPage() {
  // dummy data 
  const curahHujan = 84;
  const risiko = "Tinggi";
  const alamat = {
    line1: "Jl. Melati No. 80",
    line2: "Kelurahan, Kecamatan, Kabupaten/Kota",
  };

  return (
    <div className="min-h-dvh bg-[#FFFDF5] text-[#364C84]">
      <div className="mx-auto max-w-[420px] px-4 py-6">
        {/* Top banner (hijau muda) */}
        <section className="rounded-t-2xl bg-[#E4F28F] px-6 pt-6 pb-5 text-center">
          <h1 className="text-center text-[20px] font-semibold text-[#364C84]">
            Bedah<span className="text-[20px] font-extrabold">Gang</span>
          </h1>

          {/* Alamat pill */}
          <div className="mt-4 rounded-2xl bg-[#F7F6F2] px-4 py-3 text-[13px] text-[#2E4270] shadow-sm">
            <div className="font-semibold text-[15px] text-black">{alamat.line1}</div>
            <div className="text-[#6F7BA6]">{alamat.line2}</div>
          </div>

          {/* Curah hujan & risiko */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#364C84] px-4 py-3 text-white shadow-sm">
              <div className="text-xs opacity-90">Curah Hujan</div>
              <div className="mt-2 text-4xl font-extrabold leading-none">
                {curahHujan}
                <span className="align-super text-2xl">%</span>
              </div>
            </div>

            <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
              <div className="text-xs text-[#6F7BA6]">Risiko Banjir</div>
              <div className="mt-1 text-3xl font-extrabold text-[#2E4270]">
                {risiko}
              </div>
              <div className="mt-1 text-[11px] text-[#6F7BA6]">Baca lebih jauh ▾</div>
            </div>
          </div>
        </section>

        {/* Body (krem) */}
        <section className="-mt-2 rounded-t-[28px] bg-[#FFFDF5] px-5 pb-10 pt-6">
          <p className="mx-auto max-w-[320px] text-center text-[15px]">
            Berdasarkan kondisi Gang-mu, solusi desain yang sesuai adalah
          </p>
          <h2 className="mt-2 text-center text-2xl font-extrabold text-[#2E4270]">
            Modul Desain #1
          </h2>

          {/* 2D placeholder */}
          <div className="mt-5 rounded-2xl bg-[#D9D9D9] p-3 shadow-sm">
            <div className="relative grid h-44 w-full place-items-center rounded-xl bg-[#D9D9D9] text-sm text-black/70">
              2D design
              {/* optional diagonal marks */}
              <span className="pointer-events-none absolute left-3 top-3 h-[calc(100%-24px)] w-[calc(100%-24px)]">
                <svg viewBox="0 0 100 100" className="h-full w-full opacity-40">

                </svg>
              </span>
            </div>
          </div>

          {/* Description + Read more */}
          <ReadMore className="mx-auto mt-3 max-w-[340px] text-center text-[13px] text-black">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna. Etiam porta sem malesuada magna mollis euismod.
            Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus.
          </ReadMore>

          {/* 3D placeholder */}
          <div className="mt-5 rounded-2xl bg-[#D9D9D9] p-3 shadow-sm">
            <div className="relative grid h-72 w-full place-items-center rounded-xl bg-[#D9D9D9] text-sm text-black/70">
              3D model
              <span className="pointer-events-none absolute left-3 top-3 h-[calc(100%-24px)] w-[calc(100%-24px)]">
                <svg viewBox="0 0 100 100" className="h-full w-full opacity-40">
\
                </svg>
              </span>
            </div>
          </div>

          <p className="mt-6 text-center text-[13px] text-[#2E4270]">
            Kamu dapat mengunduh file PDF untuk memahami lebih lanjut!
          </p>
          <div className="mt-3 flex justify-center">
            <a
              href="#"
              className="w-60 rounded-full bg-[#2E4270] px-5 py-3 text-center text-sm font-semibold text-white shadow hover:bg-[#273a67] active:scale-[0.99]"
            >
              Unduh PDF Guidebook
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ----- Read more / less component ----- */
function ReadMore({
  children,
  className,
  initialLines = 2,
}: {
  children: React.ReactNode;
  className?: string;
  initialLines?: number;
}) {
  const [open, setOpen] = useState(false);

  // Inline clamp (no Tailwind plugin needed)
  const clampStyle = !open
    ? ({
        display: "-webkit-box",
        WebkitLineClamp: initialLines,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      } as React.CSSProperties)
    : undefined;

  return (
    <div className={className}>
      <p style={clampStyle}>{children}</p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mx-auto mt-1 block rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-semibold text-[#2E4270]"
      >
        {open ? "Tutup" : "Baca lebih jauh ▾"}
      </button>
    </div>
  );
}
