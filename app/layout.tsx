import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RateMyProfessor.space - AI Professor Review Generator | Create Authentic College Reviews",
  description:
    "Generate authentic professor reviews instantly with AI. Create natural, engaging reviews for RateMyProfessor, Reddit, and academic forums. No registration required - 10,000+ reviews generated.",
  keywords: [
    "professor review generator",
    "rate my professor",
    "AI professor review",
    "college professor evaluation",
    "student review tool",
    "academic review generator",
    "university professor rating",
    "professor feedback generator",
    "college review writing",
    "student evaluation tool",
  ],
  authors: [{ name: "RateMyProfessor.space" }],
  creator: "RateMyProfessor.space",
  publisher: "RateMyProfessor.space",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ratemyprofessor.space",
    title: "AI Professor Review Generator - Create Authentic College Reviews",
    description:
      "Generate authentic professor reviews instantly with AI. Perfect for RateMyProfessor, Reddit, and academic forums. No registration required.",
    siteName: "RateMyProfessor.space",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Professor Review Generator - RateMyProfessor.space",
    description:
      "Generate authentic professor reviews instantly with AI. No registration required - 10,000+ reviews generated.",
    creator: "@ratemyprofessor",
  },
  alternates: {
    canonical: "https://ratemyprofessor.space",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
