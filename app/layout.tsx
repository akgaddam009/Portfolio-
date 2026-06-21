import type { Metadata } from "next";
import { Inter, DM_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import AnalyticsClient from "@/components/AnalyticsClient";
import RouteProgress from "@/components/RouteProgress";
import LaunchSplash from "@/components/LaunchSplash";

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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)",  color: "#000000" },
  ],
};

export const metadata: Metadata = {
  title: "Arun Gaddam — Senior Product Designer",
  description:
    "Senior Product Designer specializing in enterprise SaaS — B2B AI tools, workflow platforms, and decision-support systems at scale.",
  metadataBase: new URL("https://arungaddamux.vercel.app"),
  alternates: {
    canonical: "https://arungaddamux.vercel.app",
  },
  openGraph: {
    title: "Arun Gaddam — Senior Product Designer",
    description:
      "I design the systems that enterprise teams depend on — turning complex workflows, ambiguous data, and organizational chaos into products people actually trust.",
    type: "website",
    url: "https://arungaddamux.vercel.app",
    siteName: "Arun Gaddam",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arun Gaddam — Senior Product Designer",
    description:
      "I design the systems that enterprise teams depend on — turning complex workflows, ambiguous data, and organizational chaos into products people actually trust.",
    creator: "@akgaddam",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='dark'||t==='light'?t:'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Arun Gaddam",
              url: "https://arungaddamux.vercel.app",
              jobTitle: "Senior Product Designer",
              description:
                "Senior Product Designer specializing in enterprise SaaS — B2B AI tools, workflow platforms, and decision-support systems at scale.",
              sameAs: [
                "https://www.linkedin.com/in/akgaddam/",
                "https://medium.com/@akgaddam",
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Hyderabad",
                addressCountry: "IN",
              },
            }),
          }}
        />
        <a href="#main-content" className="skip-nav">Skip to content</a>
        <Cursor />
        <RouteProgress />
        {children}
        <LaunchSplash />
        <AnalyticsClient />
      </body>
    </html>
  );
}
