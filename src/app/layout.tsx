import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "antd/dist/reset.css";
import "./globals.css";
import React from "react";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Medical Pantry",
  description: "Making healthcare environmentally sustainable",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
