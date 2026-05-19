import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AntdProvider } from "@/components/dashboard/AntdProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Underwrite — AI copilot for credit underwriting",
  description:
    "AI copilot for credit teams at manufacturing OEMs and supply-chain NBFCs. Drafts the proposal note, recommends a credit limit with audit-grade reasoning, and captures structured overrides.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <AntdRegistry>
          <AntdProvider>{children}</AntdProvider>
        </AntdRegistry>
        <Analytics />
      </body>
    </html>
  );
}
