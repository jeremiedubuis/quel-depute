import Link from 'next/link';
import { RecoilRoot } from 'recoil';
import { SharedData } from '$components/layout/SharedData';
export default function App({ Component, pageProps }) {
    return (
        <RecoilRoot>
            <header id="header">
                <Link href="/">
                    <a>
                        <img src="/img/logo-light.svg" alt="" />
                    </a>
                </Link>
            </header>
            <SharedData />
            <Component {...pageProps} />
        </RecoilRoot>
    );
}
