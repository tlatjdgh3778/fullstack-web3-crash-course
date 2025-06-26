import type { Metadata } from "next";

import Header from "@/components/Header";

import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "TSender",
  description: "TSender UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
