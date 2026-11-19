import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

// Atkinson Hyperlegible Next: dirancang untuk keterbacaan bagi pembaca low-vision.
const atkinson = Atkinson_Hyperlegible_Next({
  variable: "--font-atkinson",
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
        <html lang="id" className={`${atkinson.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#konten-utama"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-white"
        >
          Lewati ke konten utama
        </a>

        <div className="border-b border-amber-300 bg-amber-50 text-amber-950">
          <p className="mx-auto max-w-6xl px-4 py-2 text-sm sm:px-6">
            <strong>Versi pilot (Bandung):</strong> tempat bertanda &quot;Data
            demo&quot; adalah simulasi. Tempat lain hanya memuat nama dan
            koordinat perkiraan dari Wikipedia, dan informasi aksesnya masih
            belum diketahui.
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