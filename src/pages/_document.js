import { Html, Head, Main, NextScript } from "next/document";
import { getFaviconUrl } from "./twofactorauthentication/reusableFun";
import { portalUrl, webSocketUrl } from "../utils/config";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <meta name="viewport"  content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />
        <link rel="shortcut icon" href={getFaviconUrl()} />
        {/* Fonts are self-hosted via next/font in _app.js */}
        {/* Preconnects to reduce initial document latency and font blocking */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {portalUrl && (
          <>
            <link rel="preconnect" href={portalUrl} />
            <link rel="dns-prefetch" href={portalUrl} />
          </>
        )}
        {webSocketUrl && (
          <>
            <link rel="preconnect" href={webSocketUrl} />
            <link rel="dns-prefetch" href={webSocketUrl} />
          </>
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
