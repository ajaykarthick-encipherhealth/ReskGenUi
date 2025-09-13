import { Html, Head, Main, NextScript } from "next/document";
import { getFaviconUrl } from "./twofactorauthentication/reusableFun";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <meta name="viewport"  content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />
        <link rel="shortcut icon" href={getFaviconUrl()} />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {/* Fonts are self-hosted via next/font in _app.js */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
