import { Html, Head, Main, NextScript } from "next/document";
import { getFaviconUrl } from "./twofactorauthentication/reusableFun";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <meta name="viewport"  content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />
        <link rel="shortcut icon" href={getFaviconUrl()} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
        {/* Avoid duplicate preconnects */}
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
