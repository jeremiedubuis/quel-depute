import { RecoilRoot } from 'recoil';
import { SharedData } from '$components/layout/SharedData';
import Head from 'next/head';
import { Header } from '$components/layout/Header/Header';
import { Footer } from '$components/layout/Footer/Footer';
import pkg from '../package.json';
console.log(pkg.version);
export default function App({ Component, pageProps }) {
    return (
        <RecoilRoot>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div id="wrapper">
                <Header />
                <SharedData />
                <Component {...pageProps} />
            </div>
            <Footer />
        </RecoilRoot>
    );
}
