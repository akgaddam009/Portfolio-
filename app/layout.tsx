import type { Metadata } from "next";
import { Manrope, Story_Script } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import AnalyticsClient from "@/components/AnalyticsClient";
import RouteProgress from "@/components/RouteProgress";
import GA4 from "@/components/GA4";
import Clarity from "@/components/Clarity";

/* Manrope, the single family for the whole site -- --font-body, --font-mono
   and --font-logo all resolve here. Manrope publishes no monospace cut, so the
   tracked uppercase label tier is proportional rather than fixed-width. */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

/* Local experiment: Story Script on the nav wordmark only. Ships one weight
   (400) because that is all the family has. */
const storyScript = Story_Script({
  variable: "--font-story-script",
  subsets: ["latin"],
  weight: ["400"],
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

const SITE_URL = "https://arungaddamux.vercel.app";
const SITE_NAME = "Arun Gaddam";
const SITE_TITLE = "Arun Gaddam — Senior Product Designer";
const SITE_DESCRIPTION =
  "Senior Product Designer with 6+ years designing enterprise SaaS products — B2B AI tools, workflow platforms, and decision-support systems. Based in Hyderabad, India. Open to senior IC and lead roles.";
const SITE_OG_DESCRIPTION =
  "I design the systems that enterprise teams depend on — turning complex workflows, ambiguous data, and organisational chaos into products people actually trust.";

export { SITE_URL, SITE_NAME };

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s — Arun Gaddam",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Arun Gaddam",
    "Product Designer",
    "UX Designer",
    "Senior Product Designer",
    "AI UX Designer",
    "Enterprise SaaS Designer",
    "B2B Product Designer",
    "Design Systems",
    "Interaction Designer",
    "UX Portfolio",
    "Product Designer Hyderabad",
    "Product Designer India",
    "AI-native product design",
  ],
  authors: [{ name: "Arun Gaddam", url: SITE_URL }],
  creator: "Arun Gaddam",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_OG_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_OG_DESCRIPTION,
    creator: "@akgaddam",
    site: "@akgaddam",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${storyScript.variable}`} suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": "https://arungaddamux.vercel.app/#person",
                name: "Arun Gaddam",
                url: "https://arungaddamux.vercel.app",
                jobTitle: "Senior Product Designer",
                description:
                  "Senior Product Designer with 6+ years designing enterprise SaaS — B2B AI tools, workflow automation platforms, and decision-support systems at scale.",
                image: "https://arungaddamux.vercel.app/arun-gaddam.webp",
                sameAs: [
                  "https://www.linkedin.com/in/akgaddam/",
                  "https://medium.com/@akgaddam",
                ],
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Hyderabad",
                  addressCountry: "IN",
                },
                knowsAbout: [
                  "Product Design",
                  "UX Design",
                  "AI UX",
                  "Enterprise SaaS",
                  "Design Systems",
                  "Interaction Design",
                  "Service Design",
                  "UX Research",
                  "Information Architecture",
                  "B2B Product Design",
                  "Workflow Automation",
                  "AI-native Products",
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": "https://arungaddamux.vercel.app/#website",
                name: "Arun Gaddam — Portfolio",
                url: "https://arungaddamux.vercel.app",
                description:
                  "Portfolio of Arun Gaddam, Senior Product Designer specialising in enterprise SaaS, AI tools, and design systems.",
                author: { "@id": "https://arungaddamux.vercel.app/#person" },
                inLanguage: "en-US",
                copyrightYear: new Date().getFullYear(),
              },
            ]),
          }}
        />
        <a href="#main-content" className="skip-nav">Skip to content</a>
        <Cursor />
        <RouteProgress />
        {children}
        <AnalyticsClient />
        <GA4 />
        <Clarity />
      </body>
    </html>
  );
}
