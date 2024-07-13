import type { Metadata } from "next";
import { Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const defaultFont = Noto_Sans_Georgian({ subsets: ["latin"] });

const ORIGIN_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";

export const metadata: Metadata = {
  title: "Todovex.ai",
  description:
    "Todovex is seamlessly organizes your task and predicts what's next using AI",
  icons: {
    icon: "/icon.ico",
  },
  metadataBase: new URL(ORIGIN_URL),
  alternates: {
    canonical: ORIGIN_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={defaultFont.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
