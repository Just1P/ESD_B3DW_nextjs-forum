import { ConditionalHeader } from "@/components/app/common/ConditionalHeader";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Forum - Discussions et Conversations",
  description: "Forum de discussions avec authentification sécurisée",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <ConditionalHeader />
          <main>{children}</main>
        </ReactQueryProvider>

        <Toaster />
      </body>
    </html>
  );
}
