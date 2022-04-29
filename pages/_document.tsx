import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head>
                {!process.env.INDEX && <meta name="robots" content="noindex" />}
                <link rel="shortcut icon" href="/img/favicon.ico" />
                <link rel="icon" href="/img/favicon.ico" />
                <link rel="icon" type="image/png" href="/img/favicon-16x16.png" sizes="16x16" />
                <link rel="icon" type="image/png" href="/img/favicon-32x32.png" sizes="32x32" />
                <link rel="icon" type="image/png" href="/img/favicon-96x96.png" sizes="96x96" />
                <link
                    rel="apple-touch-icon-precomposed"
                    sizes="152x152"
                    href="/img/apple-touch-icon.png"
                />
                <link rel="stylesheet" href="/css/theme-light.css" />
                <link rel="stylesheet" href="/css/global.css" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
