import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link 
          rel="preconnect" 
          href="https://fonts.gstatic.com" 
          crossOrigin="anonymous" 
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Satisfy&family=Amatic+SC:wght@400;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Favicons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* PWA */}
        <meta name="theme-color" content="#3E2723" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* SEO */}
        <meta name="description" content="Closetly - Your personal digital wardrobe. Catalog your clothing, generate outfits, and discover your unique style." />
        <meta name="keywords" content="wardrobe, fashion, style, outfit, clothing, closet, digital wardrobe" />
        <meta name="author" content="Closetly" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://closetly.app/" />
        <meta property="og:title" content="Closetly - Your Digital Wardrobe" />
        <meta property="og:description" content="Catalog your clothing, generate outfits, and discover your unique style with Closetly." />
        <meta property="og:image" content="https://closetly.app/og-image.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://closetly.app/" />
        <meta property="twitter:title" content="Closetly - Your Digital Wardrobe" />
        <meta property="twitter:description" content="Catalog your clothing, generate outfits, and discover your unique style with Closetly." />
        <meta property="twitter:image" content="https://closetly.app/og-image.jpg" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
