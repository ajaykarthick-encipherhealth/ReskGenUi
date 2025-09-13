import { Html, Head, Main, NextScript } from "next/document";
import { getFaviconUrl } from "./twofactorauthentication/reusableFun";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />
        <link rel="shortcut icon" href={getFaviconUrl()} />
        
        {/* Resource hints for better performance */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical resources for LCP optimization */}
        <link rel="preload" href="/_next/static/css/globals.css" as="style" />
        <link rel="preload" href="/logo192.png" as="image" type="image/png" />
        <link rel="preload" href="/favicon.png" as="image" type="image/png" />
        
        {/* Preload critical fonts */}
        <link rel="preload" href="/_next/static/css/fonts.css" as="style" />
        
        {/* Preconnect to API domains */}
        <link rel="preconnect" href="https://api.yourdomain.com" />
        <link rel="dns-prefetch" href="//api.yourdomain.com" />
        
        {/* Load non-critical CSS with media="print" then switch to "all" */}
        <link rel="preload" href="/bootstrap.min.css" as="style" onLoad="this.onload=null;this.rel='stylesheet'" />
        <link rel="preload" href="/nprogress.css" as="style" onLoad="this.onload=null;this.rel='stylesheet'" />
        <link rel="preload" href="/fontawesome.css" as="style" onLoad="this.onload=null;this.rel='stylesheet'" />
        <link rel="preload" href="/primereact-theme.css" as="style" onLoad="this.onload=null;this.rel='stylesheet'" />
        <link rel="preload" href="/primereact.css" as="style" onLoad="this.onload=null;this.rel='stylesheet'" />
        
        {/* Fallback for browsers that don't support preload */}
        <noscript>
          <link rel="stylesheet" href="/bootstrap.min.css" />
          <link rel="stylesheet" href="/nprogress.css" />
          <link rel="stylesheet" href="/fontawesome.css" />
          <link rel="stylesheet" href="/primereact-theme.css" />
          <link rel="stylesheet" href="/primereact.css" />
        </noscript>

        {/* Critical CSS inlined to prevent render blocking */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical above-the-fold styles */
            body { margin: 0; font-family: var(--font-poppins), -apple-system, BlinkMacSystemFont, sans-serif; }
            .loading-placeholder { 
              background: linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%);
              background-size: 400% 100%;
              animation: skeleton 1.4s ease infinite;
            }
            @keyframes skeleton { 0% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
            /* Prevent layout shifts */
            img { height: auto; }
            .table-container { min-height: 400px; }
            .patient-status { width: 120px; height: 32px; }
          `
        }} />
        
        {/* Fonts are self-hosted via next/font in _app.js */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
