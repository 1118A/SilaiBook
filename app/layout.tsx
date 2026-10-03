import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Gujarati, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gujaratiFont = Noto_Sans_Gujarati({
  variable: "--font-noto-gujarati",
  subsets: ["gujarati"],
  weight: ["400", "500", "700", "800"],
});

const devanagariFont = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "SilaiBook — Piece-Rate Payroll",
  description:
    "Track pieces, verify work, calculate salaries for garment units. Simple payroll for tailors and managers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} ${gujaratiFont.variable} ${devanagariFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans leading-relaxed">{children}</body>
    </html>
  );
}
