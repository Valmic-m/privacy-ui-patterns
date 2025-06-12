import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Privacy UI Pattern Library",
  description: "A curated collection of privacy-focused UI patterns that adhere to Privacy by Design principles and Nielsen's Heuristics.",
  keywords: ["privacy", "UI patterns", "design", "GDPR", "CCPA", "privacy by design"],
  authors: [{ name: "Privacy UI Library Contributors" }],
  creator: "Privacy UI Library",
  publisher: "Privacy UI Library",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://privacyui.design",
    siteName: "Privacy UI Pattern Library",
    title: "Privacy UI Pattern Library",
    description: "A curated collection of privacy-focused UI patterns that adhere to Privacy by Design principles and Nielsen's Heuristics.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy UI Pattern Library",
    description: "A curated collection of privacy-focused UI patterns that adhere to Privacy by Design principles and Nielsen's Heuristics.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
