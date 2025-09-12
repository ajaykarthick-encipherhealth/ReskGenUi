import { Html, Head, Main, NextScript } from "next/document";
import { getFaviconUrl } from "./twofactorauthentication/reusableFun";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport"  content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />
        <link rel="shortcut icon" href={getFaviconUrl()} />
        {/* Fonts are loaded via next/font. External Google Fonts links removed. */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
