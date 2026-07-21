import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Sidebar, MobileNav } from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cyber Tracker — Security Learning Roadmap",
  description:
    "Personal cybersecurity learning tracker: Security+, AppSec, OT/ICS, Cloud Security and GRC roadmap.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full">
        {/* Persistent global navigation: fixed rail on lg+, top bar below. */}
        <Sidebar />
        <MobileNav />

        {/* Offset matches the sidebar width so content never sits beneath it. */}
        <div className="lg:pl-60">
          <main className="min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  );
}
