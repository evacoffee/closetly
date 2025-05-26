import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ThemePicker } from '@/components/ThemePicker'
import { MobileNavigation } from '@/components/MobileNavigation'
import { KittenLogo } from '@/components/KittenLogo'

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
          href="https://fonts.googleapis.com/css2?family=Satisfy&family=Amatic+SC:wght@400;700&family=Crimson+Pro:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-background text-text min-h-screen overscroll-none">
        <ThemeProvider>
          <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-primary/10">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KittenLogo className="text-primary" />
                <h1 className="font-satisfy text-2xl text-primary">FIT</h1>
              </div>
              <div className="flex items-center gap-4">
                <ThemePicker />
              </div>
            </div>
          </header>
          <main className="container mx-auto px-4 py-6 pb-[calc(4rem+env(safe-area-inset-bottom))]">
            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          </main>
          <MobileNavigation />
        </ThemeProvider>
      </body>
    </html>
  )
}
