import type { Metadata } from "next";
import { Inter, DM_Mono, Instrument_Serif } from "next/font/google";
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

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  style: ["italic"],
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
    <html lang="en" className={`${inter.variable} ${dmMono.variable} ${instrumentSerif.variable}`}>
      <body>
        {/* Sync theme before first paint — prevents flash behind the loader */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);else if(window.matchMedia('(prefers-color-scheme:dark)').matches)document.documentElement.setAttribute('data-theme','dark');}catch(e){}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
