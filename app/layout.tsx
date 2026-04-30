import type { Metadata } from "next";
import { Inter, DM_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import GrainOverlay from "@/components/GrainOverlay";
import Cursor from "@/components/Cursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
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
    url: "https://arungaddam.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arun Gaddam — Senior Product Designer",
    description:
      "I design the systems that enterprise teams depend on — turning complex workflows, ambiguous data, and organizational chaos into products people actually trust.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmMono.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body>
        {/* Sync theme before first paint — prevents flash behind the loader */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);else if(window.matchMedia('(prefers-color-scheme:dark)').matches)document.documentElement.setAttribute('data-theme','dark');}catch(e){}`,
          }}
        />
        {/* Skip to main content — for keyboard/screen-reader users (CSS-only, no JS needed) */}
        <a href="#main-content" className="skip-nav">Skip to content</a>
        <Cursor />
        <GrainOverlay />
        {children}
      </body>
    </html>
  );
}
