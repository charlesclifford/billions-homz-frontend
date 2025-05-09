import { Toaster } from "@/components/ui/sonner";
import Providers from "@/providers/Providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { Suspense } from "react";
import Loading from "./loading";
import { config } from "@/utils/config";

const { SITE_NAME, SITE_DESCRIPTION, SITE_URL } = config;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  keywords: [
    "real estate",
    "property listings",
    "buy property",
    "rent property",
    "real estate agency",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: `/images/IMG_8216.PNG`, // OpenGraph image
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    images: ["/images/IMG_8216.PNG"],
    creator: "@onidev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader color="#EE6C0E" showSpinner={false} />
        <Providers>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </Providers>
        <Toaster position="top-right" richColors expand={true} closeButton />
      </body>
    </html>
  );
}
