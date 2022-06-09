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
            <p></p>
            <Nav primary className={styles.nav} />
        </footer>
    );
};
