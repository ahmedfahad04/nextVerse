import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "nextVerse - Quran Memorizer",
  description: "A Quran memorization helper application",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "nextVerse",
    statusBarStyle: "black-translucent",
  },
};

export const viewport = {
  themeColor: "#064e3b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${amiri.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
