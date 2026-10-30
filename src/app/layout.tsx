import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AksesKita",
    template: "%s | AksesKita",
  },
  description:
    "Peta dan direktori informasi aksesibilitas fisik tempat umum berbasis kontribusi komunitas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#konten-utama"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-white"
        >
          Lewati ke konten utama
        </a>

        <div className="border-b border-amber-300 bg-amber-50 text-amber-950">
          <p className="mx-auto max-w-6xl px-4 py-2 text-sm sm:px-6">
            <strong>Mode demo:</strong> semua tempat dan status akses di situs
            ini adalah simulasi untuk pengembangan, bukan kondisi lokasi nyata.
          </p>
        </div>

        <SiteHeader />

        <main
          id="konten-utama"
          tabIndex={-1}
          className="flex-1 focus-visible:outline-none"
        >
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}