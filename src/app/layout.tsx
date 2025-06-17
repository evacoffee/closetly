import './globals.css'
import type { Metadata } from 'next'
import * as React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemePicker } from '@/components/ThemePicker';
import { MobileNavigation } from '@/components/MobileNavigation';
import { AppIcon } from '@/components/AppIcon';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { PreferencesModal } from '@/components/outfit/PreferencesModal';
import { DEFAULT_PREFERENCES, savePreferences } from '@/lib/preferences';

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
  const [isPreferencesOpen, setIsPreferencesOpen] = React.useState(false);
  const [userPreferences, setUserPreferences] = React.useState(DEFAULT_PREFERENCES);
  
  // Load preferences on mount
  React.useEffect(() => {
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      setUserPreferences(JSON.parse(savedPrefs));
    }
  }, []);

  return (
    <html lang="en" className="antialiased">
      <body className="bg-background text-text min-h-screen overscroll-none font-sans">
        <ThemeProvider>
          <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-sm border-b border-coffee-800 shadow-sm">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between w-full gap-4">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <AppIcon className="text-caramel" />
                  <h1 className="font-playfair text-2xl font-bold text-cream">Closetly</h1>
                </div>
                <div className="flex-1 max-w-md mx-2">
                  <SearchBar />
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsPreferencesOpen(true)}
                    className="text-foreground hover:bg-accent/50"
                  >
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Preferences</span>
                  </Button>
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
          <PreferencesModal
            isOpen={isPreferencesOpen}
            onOpenChange={setIsPreferencesOpen}
            initialPreferences={userPreferences}
            onSave={(newPreferences) => {
              setUserPreferences(newPreferences);
              savePreferences(newPreferences);
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
