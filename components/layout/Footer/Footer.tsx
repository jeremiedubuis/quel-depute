import styles from './Footer.module.css';
import React from 'react';
import Link from 'next/link';
import { Nav } from '$components/layout/Nav/Nav';

export const Footer: React.FC = () => {
    return (
        <footer id="footer" className={styles.footer}>
            <Link href="/">
                <a>
                    <img src="/img/logo-dark.svg" alt="" />
                </a>
            </Link>
            <p>
                A falsis, lamia castus pes.Gallus moris, tanquam bi-color hydra.A falsis, demissio
                bassus barcas.Fermium de bi-color turpis, perdere lura!
            </p>
            <Nav primary className={styles.nav} />
        </footer>
    );
};
