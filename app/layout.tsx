import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProScreener | Real-Time Stock Screener",
  description: "Production-grade real-time stock screener application.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
