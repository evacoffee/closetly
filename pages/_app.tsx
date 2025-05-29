import * as React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import SplashScreen from '@/components/SplashScreen';
import '@/styles/global.css';

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Track page views
  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      // You can add analytics tracking here
      console.log(`App is navigating to: ${url}`);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <meta name="theme-color" content="#855E42" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="description" content="FIT - Your personal style assistant" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      
      {/* Splash Screen */}
      <SplashScreen />
      
      {/* Main App Content */}
      <div className="min-h-screen flex flex-col">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default App;
