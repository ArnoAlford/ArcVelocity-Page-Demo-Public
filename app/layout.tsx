import type { Metadata, Viewport } from "next";
import { Caveat, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import "./site-header.css";

const siteUrl = "https://arcvelocity.com";
const siteTitle = "ArcVelocity | DFW On-Site AI Implementation for Real Workflows";
const siteDescription =
  "DFW-based, hands-on AI implementation for businesses that need supervised AI installed into real workflows with clearer handoffs, follow-through, and visibility.";

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "ArcVelocity",
  url: siteUrl,
  description:
    "Bedford-based AI and workflow implementation company helping Dallas-Fort Worth businesses install supervised AI systems into real operations.",
  logo: {
    "@type": "ImageObject",
    url: `${siteUrl}/images/arcvelocity-logo-home.webp`
  },
  foundingDate: "2026",
  email: "arcvelocity@runbox.biz",
  telephone: "+1-714-325-8213",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bedford",
    addressRegion: "TX",
    addressCountry: "US"
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Dallas-Fort Worth, Texas"
  },
  knowsAbout: [
    "AI implementation",
    "Workflow automation",
    "Supervised AI systems",
    "Business process improvement",
    "Search engine optimization"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer inquiries",
    telephone: "+1-714-325-8213",
    email: "arcvelocity@runbox.biz",
    areaServed: "US-TX",
    availableLanguage: "English"
  }
};

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "optional",
  preload: false
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "optional",
  preload: false
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hand",
  display: "swap",
  preload: false
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: "ArcVelocity",
  authors: [{ name: "ArcVelocity", url: siteUrl }],
  creator: "ArcVelocity",
  publisher: "ArcVelocity",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png"
  },
  alternates: {
    canonical: "/"
  },
  keywords: [
    "DFW AI implementation",
    "Dallas-Fort Worth AI contractor",
    "on-site AI implementation",
    "supervised AI workflows",
    "workflow automation consulting",
    "AI workflow diagnostic",
    "North Texas AI implementation"
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: "ArcVelocity",
    images: [
      {
        url: "/images/hero-poster.webp",
        width: 1536,
        height: 1024,
        alt: "ArcVelocity homepage hero"
      }
    ],
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/images/hero-poster.webp"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  category: "technology"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${caveat.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
