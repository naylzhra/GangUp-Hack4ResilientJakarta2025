"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Geo = { lat: number; lng: number; accuracy?: number };
type Address = {
  jalan?: string;
  nomor?: string;
  kelurahan?: string;
  kecamatan?: string;
  kabupatenKota?: string;
  provinsi?: string;
  kodePos?: string;
  full?: string;
};

export default function LocationPage() {
  const [askOpen, setAskOpen] = useState(true);
  const [coords, setCoords] = useState<Geo | null>(null);
  const [status, setStatus] = useState<"idle" | "requesting" | "granted" | "denied" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [addr, setAddr] = useState<Address | null>(null);
  const [addrLoading, setAddrLoading] = useState(false);
  const [addrError, setAddrError] = useState<string | null>(null);

  const center = useMemo<Geo>(() => coords ?? { lat: -6.2, lng: 106.816666 }, [coords]); // fallback Jakarta

  function requestLocation() {
    setStatus("requesting");
    setErrorMsg(null);

    if (!("geolocation" in navigator)) {
      setStatus("error");
      setErrorMsg("Perangkat/browser tidak mendukung geolokasi.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setCoords({ lat: latitude, lng: longitude, accuracy });
        setStatus("granted");
        setAskOpen(false);
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
        setErrorMsg(err.message);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  }

  // Reverse geocoding ketika koordinat sudah ada
  useEffect(() => {
    if (!coords) return;

    const ctrl = new AbortController();
    setAddrLoading(true);
    setAddrError(null);

    // Nominatim public endpoint — good for low traffic. Keep attribution.
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", String(coords.lat));
    url.searchParams.set("lon", String(coords.lng));
    url.searchParams.set("zoom", "18");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("accept-language", "id"); // Bahasa Indonesia jika ada

    fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: ctrl.signal,
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Reverse geocoding gagal (${r.status})`);
        const json = await r.json();
        const parsed = parseOsmAddress(json.address ?? {}, json.display_name);
        setAddr(parsed);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setAddrError(String(e.message || e));
      })
      .finally(() => setAddrLoading(false));

    return () => ctrl.abort();
  }, [coords]);

  return (
    <div className="min-h-dvh bg-[#2E4270] text-slate-900">
      <div className="mx-auto max-w-[420px] px-4 py-6">
        <div className="overflow-hidden rounded-2xl bg-[#FBFCF9] shadow-xl ring-1 ring-black/5">
          {/* Header */}
          <div className="bg-[#2E4270] px-6 pt-6 pb-4 text-center">
            <h1 className="text-xl font-semibold tracking-wide text-white">
              Bedah<span className="font-bold">Gang</span>
            </h1>
            <p className="mt-2 text-xs text-white/80">Deteksi lokasi otomatis</p>
          </div>

          {/* Body */}
          <div className="space-y-4 px-5 pb-6 pt-5">
            {/* Map */}
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="h-64 w-full">
                <LeafletMap center={center} user={coords} />
              </div>
            </div>

            {/* Lokasi teks */}
            <div className="rounded-xl border border-[#2E4270]/30 bg-white p-4">
              <div className="text-sm font-medium text-[#2E4270]">Lokasi Anda</div>

              {coords ? (
                <>
                  <div className="mt-1 text-sm text-slate-700">
                    <div>
                      Lat: <span className="font-mono">{coords.lat.toFixed(6)}</span>
                      {"  "}Lng: <span className="font-mono">{coords.lng.toFixed(6)}</span>
                    </div>
                    {coords.accuracy !== undefined && (
                      <div className="mt-1 text-xs text-slate-500">
                        Akurasi &plusmn; {Math.round(coords.accuracy)} m
                      </div>
                    )}
                  </div>

                  <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">
                    {addrLoading && <span className="text-slate-500">Mengambil alamat…</span>}
                    {addrError && <span className="text-rose-600">{addrError}</span>}
                    {!addrLoading && !addrError && addr && (
                      <>
                        <div className="font-semibold text-slate-800">
                          {formatAddressLine(addr)}
                        </div>
                        <div className="mt-1 text-xs text-slate-600">
                          Kel. {addr.kelurahan ?? "-"} • Kec. {addr.kecamatan ?? "-"}
                          <br />
                          {addr.kabupatenKota ?? "-"}, {addr.provinsi ?? "-"} {addr.kodePos ?? ""}
                        </div>
                        {addr.full && (
                          <div className="mt-2 text-[11px] text-slate-500">({addr.full})</div>
                        )}
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="mt-1 text-sm text-slate-500">
                  Belum ada lokasi. Izinkan akses lokasi untuk melanjutkan.
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setAskOpen(true)}
                  className="rounded-full bg-[#3A54A0] px-4 py-2 text-xs font-semibold text-white hover:bg-[#344C90] active:scale-[0.99]"
                >
                  {coords ? "Ambil Ulang Lokasi" : "Izinkan Lokasi"}
                </button>
                {status === "denied" && (
                  <span className="text-xs text-rose-600">
                    Akses ditolak — ubah izin lokasi di pengaturan browser lalu coba lagi.
                  </span>
                )}
                {status === "error" && errorMsg && (
                  <span className="text-xs text-rose-600">{errorMsg}</span>
                )}
              </div>

              <div className="mt-2 text-[10px] text-slate-400">
                Peta oleh © OpenStreetMap contributors • Geocoding oleh Nominatim
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-permission modal */}
      {askOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-[420px] rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="text-base font-semibold text-[#2E4270]">
              Izinkan <span className="font-bold">BedahGang</span> mengakses lokasi Anda?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Kami gunakan untuk memusatkan peta dan mengisi alamat otomatis.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setAskOpen(false)}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"
              >
                Batal
              </button>
              <button
                onClick={requestLocation}
                className="rounded-full bg-[#3A54A0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#344C90]"
              >
                Izinkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------- Map ----------------- */

function LeafletMap({ center, user }: { center: { lat: number; lng: number }; user: Geo | null }) {
  return (
    <MapContainer className="h-full w-full">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        //attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {user && (
        <>
          <Recenter lat={user.lat} lng={user.lng} />
          <CircleMarker center={[user.lat, user.lng]} pathOptions={{ color: "#3A54A0", weight: 2, fillOpacity: 0.9 }} />
          <Popup position={[user.lat, user.lng]}>
            Anda di sini
            <br />
            {user.lat.toFixed(5)}, {user.lng.toFixed(5)}
          </Popup>
        </>
      )}
    </MapContainer>
  );
}

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 16, { animate: true });
  }, [lat, lng, map]);
  return null;
}

/* -------- Helpers: parse & format address -------- */

function parseOsmAddress(a: any, displayName?: string): Address {
  // OSM sering berbeda-beda per wilayah. Urutan fallback dibuat untuk Indonesia.
  const jalan = a.road || a.residential || a.pedestrian || a.footway || a.path;
  const nomor = a.house_number;
  const kelurahan = a.village || a.suburb || a.neighbourhood; // Kel/Desa sering masuk sini
  const kecamatan = a.city_district || a.district || a.suburb; // Kec kadang city_district/district
  const kabupatenKota = a.city || a.town || a.municipality || a.county; // Kota/Kabupaten
  const provinsi = a.state;
  const kodePos = a.postcode;

  return {
    jalan,
    nomor,
    kelurahan,
    kecamatan,
    kabupatenKota,
    provinsi,
    kodePos,
    full: displayName,
  };
}

function formatAddressLine(a: Address) {
  const jalanLine = [a.jalan, a.nomor && `No. ${a.nomor}`].filter(Boolean).join(" ");
  return jalanLine || a.full || "Alamat tidak ditemukan";
}
