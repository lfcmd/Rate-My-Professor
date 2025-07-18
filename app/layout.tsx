import type React from "react"
import type { Metadata } from "next"
import { Inter, Lora } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { MainHeader } from "@/app/components/main-header"
import { Footer } from "@/app/components/footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const lora = Lora({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: "AI-Powered Professor Review Generator for Students",
  description: "Generate authentic professor reviews effortlessly with AI! Share insights on RateMyProfessor and academic forums without any registration.",
  keywords: [
    "AI professor review generator",
    "authentic college reviews",
    "RateMyProfessor",
    "student community",
    "customizable review tone",
    "advanced AI technology",
    "online course evaluations",
    "generate engaging reviews",
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
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4704669548339622"
          crossOrigin="anonymous"
        ></script>
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-74FCWPESBE"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-74FCWPESBE');
            `,
          }}
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={`${inter.variable} ${lora.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="flex flex-col min-h-screen">
            <MainHeader />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
