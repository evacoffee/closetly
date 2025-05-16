import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ThemePicker } from '@/components/ThemePicker'
import { MobileNavigation } from '@/components/MobileNavigation'

export const metadata: Metadata = {
  title: 'FIT - Digital Wardrobe',
  description: 'Catalog your clothing, generate outfits, and connect with fashion enthusiasts',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  applicationName: 'FIT',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FIT App'
  },
  formatDetection: {
    telephone: false
  },
  themeColor: '#855E42',
  manifest: '/manifest.json'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Satisfy&family=Amatic+SC:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-background text-text min-h-screen overscroll-none">
        <ThemeProvider>
          <main className="container mx-auto px-4 pb-[calc(4rem+env(safe-area-inset-bottom))]">
            {children}
          </main>
          <MobileNavigation />
          <ThemePicker />
        </ThemeProvider>
      </body>
    </html>
  )
}
