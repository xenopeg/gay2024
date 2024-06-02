import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BerryTube GayPoll2024Deluxe",
  description: "a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-900">{children}</body>
    </html>
  );
}
