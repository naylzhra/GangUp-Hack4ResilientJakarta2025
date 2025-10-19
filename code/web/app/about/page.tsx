"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import SekolahImage from "../../public/sekolah.png";
import AxonomImage from "../../public/axonom.png";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-dvh bg-[#FFFDF5] text-[#364C84] flex flex-col items-center">
      <div className="mx-auto w-full max-w-[420px] px-4 py-6 flex flex-col">

        {/* Header */}
          <div className="rounded-t-2xl bg-[#FFFDF5] px-6 pt-6 pb-5 text-center">
            <h1 className="text-xl font-semibold tracking-wide text-[#364C84]">
              Bedah<span className="font-extrabold">Gang</span>
            </h1>
          </div>

        {/* HERO */}
        <section className="flex flex-col items-center text-center">
          <p className="text-base font-medium leading-snug text-[#52452C]">
            Gang berperan lebih dari sekadar jalan untuk dilalui, melainkan sebuah{" "}
            <span className="font-extrabold">ruang hidup yang terus tumbuh dan berkembang.</span>
          </p>
        </section>

        <section className="flex justify-center relative h-[300px]">
            <div className="w-[500px]">
              <Image
                src={SekolahImage}
                alt="BedahGang Poster"
                fill
                className="rounded-xl"
              />
            </div>
        </section>

        {/* INTRO */}
        <section className="mt-8 bg-gradient-to-b from-[#E7F1A8] to-transparent p-4 rounded-none text-sm leading-relaxed">
          <p>
            <span className="font-semibold">BedahGang</span> adalah inisiatif yang dimulai dari ide
            akan potensi tersembunyi gang sebagai elemen urban yang mampu memperkuat relasi antar
            warga dan dengan lingkungannya yang lebih luas.
          </p>
          <p className="mt-3">
            Gerakan ini berupaya membuka potensi desain dari elemen masyarakat untuk membentuk ruang
            hidup bersama.
          </p>
        </section>

        {/* TUJUAN */}
        <section className="mt-10 w-full bg-[#FFFDF5] px-5 py-8 rounded-2xl text-white">
          <div className="px-0 py-10 flex flex-col items-center">
            <h2 className="text-xl font-bold text-[#2F4F90] mb-6 text-center">
              Apa tujuan kami?
            </h2>

            <div className="w-full flex flex-col gap-2 text-sm  leading-relaxed text-white font-small">
              <div className="bg-black/30 h-30 px-4 py-4 rounded-r-xl mr-15 leading-snug">
                <p>
                  Menjembatani <span className="font-semibold">komunitas masyarakat</span> dengan berbagai{" "}
                  <span className="italic">stakeholder</span> melalui solusi desain yang berbasis{" "}
                  <span className="font-semibold">konteks nyata dan pengalaman hidup sehari-hari.</span>
                </p>
              </div>

              <div className="bg-black/30 h-30 px-4 py-4 rounded-l-xl ml-15 max-w-[95%] self-center leading-snug">
                <p>
                  Menyalurkan <span className="font-semibold">arahan desain</span> beserta rincian{" "}
                  <span className="italic">estimasi anggaran</span> untuk ragam{" "}
                  <span className="font-semibold">tipologi area riskan banjir</span> di sekitar Jakarta.
                </p>
              </div>

              <div className="bg-black/30 h-30 px-4 py-4 rounded-r-xl leading-snug mr-15">
                <p>
                  Membangun <span className="font-semibold">komunitas kampung yang tangguh</span> dengan
                  memperhatikan suara masyarakat dalam menentukan solusi{" "}
                  <span className="font-semibold">desain dan keputusan.</span>
                </p>
              </div>
            </div>
          </div>
        </section>


        <section className="mt-2 text-sm leading-relaxed">
          <p>
            Dalam merancang tool kit ini, kami meneliti tipologi gang di tiga kampung:
            <span className="font-semibold"> Kampung Melayu, Pala Hampangan,</span> dan
            <span className="font-semibold"> Pademangan.</span>
          </p>
          <p className="mt-3">
            Ketiganya dipilih karena mewakili kondisi wilayah berbeda, sehingga menjadi dasar bagi
            matriks desain kami.
          </p>
        </section>

        <section className="flex justify-center">
            <div className="w-full">
              <Image
                src={AxonomImage}
                alt="BedahGang Poster"
                className="rounded-xl"
              />
            </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-4 text-[10px] text-center text-[#364C84]/60">
          <p>
            © Dataset Reference: Shabrina, Z., Muharram, F. W., Dhirgantara Putra, D., Rui, J., & Asa, M. (2025).<br />
             Hack4Resilient Jakarta 2025: Sinking City [Data set]. Zenodo. https://doi.org/10.5281/zenodo.16836145 
          </p>
        </footer>
      </div>
    </div>
  );
}
