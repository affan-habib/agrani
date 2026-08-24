import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agrani Technologies & Services Limited",
  description: "Innovative IT solutions for a smarter Bangladesh.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
