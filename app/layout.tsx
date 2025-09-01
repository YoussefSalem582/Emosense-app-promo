import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "EmoSense App Portfolio",
  description: "EmoSense App - AI-powered emotion detection Flutter application portfolio",
  icons: {
    icon: "/images/app-icon.png",
    shortcut: "/images/app-icon.png",
    apple: "/images/app-icon.png",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
