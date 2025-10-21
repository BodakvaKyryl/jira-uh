import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { cn } from "@/lib/utils";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jira-uh",
  description: "Project management tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen antialiased")}>
        <NuqsAdapter>
          <Providers>
            <Toaster />
            {children}
          </Providers>{" "}
        </NuqsAdapter>
      </body>
    </html>
  );
}
