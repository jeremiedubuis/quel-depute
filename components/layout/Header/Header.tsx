import styles from './Header.module.css';
import React from 'react';
import Link from 'next/link';
import { Nav } from '$components/layout/Nav/Nav';

export const Header: React.FC = () => {
    return (
        <header id="header" className={styles.header}>
            <Link href="/">
                <a>
                    <img src="/img/logo-light.svg" alt="" />
                </a>
            </Link>
            <Nav className={styles.nav} />
        </header>
    );
};
