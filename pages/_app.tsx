import Link from 'next/link';
export default function App({ Component, pageProps }) {
    return (
        <>
            <header id="header">
                <Link href="/">
                    <a>
                        <img src="/img/logo-light.png" alt="" />
                    </a>
                </Link>
            </header>
            <Component {...pageProps} />
        </>
    );
}
