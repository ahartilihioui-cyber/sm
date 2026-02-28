import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Car Manager - Gestion des Voitures",
  description: "Application de gestion des voitures",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black min-h-screen text-white`}
      >
        <AuthProvider>
          {/* Floating car background decorations */}
          <div className="car-bg-icon car-bg-1">🚗</div>
          <div className="car-bg-icon car-bg-2">🏎️</div>
          <div className="car-bg-icon car-bg-3">🚙</div>
          <div className="car-bg-icon car-bg-4">🚕</div>
          <div className="car-bg-icon car-bg-5">🏁</div>
          <div className="relative z-10">
            <Navbar />
            <main>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
