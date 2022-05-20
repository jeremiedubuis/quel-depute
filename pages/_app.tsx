import { RecoilRoot } from 'recoil';
import { SharedData } from '$components/layout/SharedData';
import Head from 'next/head';
import { Header } from '$components/layout/Header/Header';
import { Footer } from '$components/layout/Footer/Footer';
import { screenSizeState } from '../atoms/screeSizeState';
export default function App({ Component, pageProps }) {
    return (
        <RecoilRoot
            initializeState={({ set }) => {
                set(screenSizeState, typeof window === 'undefined' ? 768 : window.innerWidth);
            }}
        >
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
