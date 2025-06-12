import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        <meta name="description" content="Closetly - Your personal digital wardrobe. Catalog your clothing, generate outfits, and discover your unique style." />
        <meta name="keywords" content="wardrobe, fashion, style, outfit, clothing, closet, digital wardrobe" />
        <meta name="author" content="Closetly" />
        
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
