import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // pilih bobot font yang mau dipakai
});

export const metadata: Metadata = {
  title: "BedahGang",
  description: "A Design Toolkit for Flood-Resilient Kampung Alleys",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakarta.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
