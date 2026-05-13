import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { AnalyticsScripts } from "@/components/layout/AnalyticsScripts";

export const metadata: Metadata = {
  metadataBase: new URL("https://aceturbo.co.uk"),
  title: {
    default: "Ace Turbo | Premier Turbocharger Distributor",
    template: "%s | Ace Turbo"
  },
  description: "Find turbochargers by registration, turbo number or vehicle details with secure checkout and B2B support.",
  openGraph: {
    title: "Ace Turbo",
    description: "Search turbochargers by reg, part number, make, model and engine.",
    type: "website",
    url: "https://aceturbo.co.uk",
    images: [{ url: "/images/ace-turbo-preview.svg", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Ace Turbo",
    description: "Premier turbocharger distributor with secure lookup and checkout.",
    images: ["/images/ace-turbo-preview.svg"]
  },
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: "/icons/favicon.svg",
    apple: "/icons/icon-192.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AnalyticsScripts />
        <Header />
        {children}
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
