"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("../_components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-2xl bg-slate-200" />
  ),
});


type Geo = { lat: number; lng: number; accuracy?: number };

type PageData = {
  location: { alamat: string; kelKec: string; kabKota: string };
  routes: { confirmPath: string; fixPath: string };
};

const MOCK_DATA: PageData = {
  location: {
    alamat: "Jl. Melati No. 80",
    kelKec: "Kelurahan, Kecamatan",
    kabKota: "Kabupaten/Kota",
  },
  routes: { confirmPath: "/input-gang?step=2", fixPath: "/input-gang?step=1" },
};

export default function LocationConfirmPage() {
  const router = useRouter();
  const d = MOCK_DATA;

  const latQ = useSearchParams().get("lat");
  const lngQ = useSearchParams().get("lng");
  const accQ = useSearchParams().get("acc");

  const coords: Geo | null = React.useMemo(() => {
    if (!latQ || !lngQ) return null;
    const lat = Number(latQ);
    const lng = Number(lngQ);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    const accuracy = accQ ? Number(accQ) : undefined;
    return { lat, lng, accuracy };
  }, [latQ, lngQ, accQ]);

  const center: Geo = React.useMemo(
    () => coords ?? { lat: -6.2, lng: 106.816666 },
    [coords]
  );

  return (
    <div className="h-dvh bg-white">
      <div className="mx-auto h-full max-w-[360px] overflow-hidden">
        <section className="relative h-[60%] bg-[#D9D9D9]">
          <div className="absolute inset-x-0 top-4 flex justify-center">
            <h1 className="text-2xl font-medium tracking-wide text-[#2F4F90]">
              <span className="text-[#364C84]">Bedah</span>
              <span className="font-bold text-[#364C84]">Gang</span>
            </h1>
          </div>

          <div className="h-[62vh] w-full pt-16 pb-28">
            <LeafletMap center={center} user={coords} />
          </div>

          <div className="absolute inset-x-4 bottom-4">
            <div className="rounded-2xl bg-white px-4 py-3 shadow">
              <p className="text-[15px] text-black">{d.location.alamat}</p>
              <p className="text-sm text-[#535353]">{d.location.kelKec}</p>
              <p className="text-sm text-[#535353]">{d.location.kabKota}</p>
            </div>
          </div>
        </section>

        <section
          className="flex h-[40%] flex-col justify-between px-6 items-center my-auto">
          <div>
            <p className="mt-4 mb-1 text-center text-sm leading-relaxed text-[#364C84]">
              Your location is used to determine{" "}
              <span className="font-semibold">precipitation</span> and{" "}
              <span className="font-semibold">flood risk</span> in the area that
              you’d like to renovate!
            </p>
            <p className="text-center text-[15px] font-semibold text-[#364C84]">
              Is the location details accurate?
            </p>
          </div>

          <div className="mt-2 mb-auto space-y-2 mx-4">
            <button
              type="button"
              onClick={() => router.push(d.routes.confirmPath)}
              className="w-full rounded-full bg-[#364C84] py-3 text-sm font-semibold text-center text-[#FFFDF5]
                         hover:brightness-110 active:brightness-95"
            >
              Yes, it’s accurate!
            </button>
            <button
              type="button"
              onClick={() => router.push(d.routes.fixPath)}
              className="w-full rounded-full bg-[#364C84]/70 py-3 text-sm text-center font-semibold text-[#FFFDF5]
                         hover:bg-gray-50 active:bg-gray-100">
              Fix the address
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export { MOCK_DATA };
export type { PageData };