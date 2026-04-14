import type { Metadata } from "next";
import { Inter, DM_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arun Gaddam — Senior Product Designer",
  description:
    "Senior Product Designer specializing in enterprise SaaS — B2B AI tools, workflow platforms, and decision-support systems at scale.",
  openGraph: {
    title: "Arun Gaddam — Senior Product Designer",
    description:
      "I design the systems that enterprise teams depend on — turning complex workflows, ambiguous data, and organizational chaos into products people actually trust.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
