import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ThemePicker } from '@/components/ThemePicker'
import { MobileNavigation } from '@/components/MobileNavigation'
import { AppIcon } from '@/components/AppIcon'
import SearchBar from '@/components/SearchBar'

export const metadata: Metadata = {
  title: 'Closetly - Digital Wardrobe',
  description: 'Catalog your clothing, generate outfits, and connect with fashion enthusiasts',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  applicationName: 'Closetly',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Closetly App'
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
          href="https://fonts.googleapis.com/css2?family=Anton&family=Russo+One&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-background text-text min-h-screen overscroll-none">
        <ThemeProvider>
          <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-primary/10">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <AppIcon className="text-primary" />
                  <h1 className="font-['Russo_One'] text-2xl text-primary">closetly</h1>
                </div>
                <div className="flex-1 max-w-md mx-2">
                  <SearchBar />
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <ThemePicker />
                </div>
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
