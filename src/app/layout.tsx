import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import React from "react";
import { ConfigProvider } from "antd";
import { Analytics } from "@vercel/analytics/react";
import { RouteGuard } from "@/components/RouteGuard";
import { AuthProvider } from '@/contexts/AuthContext';

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

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
      <body className={`${montserrat.className}`}>
        <AuthProvider>
          <ConfigProvider
            theme={{
              token: {
                fontFamily: "inherit",
                colorPrimary: "#BF0018",
              },
            }}
          >
            {children}

            <Analytics />
          </ConfigProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
