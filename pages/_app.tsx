import Link from 'next/link';
import { RecoilRoot } from 'recoil';
import { SharedData } from '$components/layout/SharedData';
import { Nav } from '$components/layout/Nav/Nav';
export default function App({ Component, pageProps }) {
    return (
        <RecoilRoot>
            <div id="wrapper">
                <header id="header">
                    <Link href="/">
                        <a>
                            <img src="/img/logo-light.svg" alt="" />
                        </a>
                    </Link>
                    <Nav />
                </header>
                <SharedData />
                <Component {...pageProps} />
            </div>
            <footer id="footer">
                <Link href="/">
                    <a>
                        <img src="/img/logo-dark.svg" alt="" />
                    </a>
                </Link>
                <p>
                    A falsis, lamia castus pes.Gallus moris, tanquam bi-color hydra.A falsis,
                    demissio bassus barcas.Fermium de bi-color turpis, perdere lura!
                </p>
                <Nav primary />
            </footer>
        </RecoilRoot>
    );
}
