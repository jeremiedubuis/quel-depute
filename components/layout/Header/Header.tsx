import styles from './Header.module.css';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Nav } from '$components/layout/Nav/Nav';
import { useRecoilState, useRecoilValue } from 'recoil';
import { screenSizeState } from '../../../atoms/screeSizeState';
import { FiMenu, FiSearch } from 'react-icons/fi';
import { mobileSearchOpenState } from '../../../atoms/mobileSearchOpenState';
import { useRouter } from 'next/router';

export const Header: React.FC = () => {
    const screenSize = useRecoilValue(screenSizeState);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchState, setMobileSearchState] = useRecoilState(mobileSearchOpenState);
    const { pathname } = useRouter();

    useEffect(() => {
        setMobileMenuOpen(false);
        setMobileSearchState(false);
    }, [pathname]);

    return (
        <header id="header" className={styles.header}>
            <Link href="/">
                <a>
                    <img src="/img/logo-light.svg" alt="" />
                </a>
            </Link>
            {screenSize < 1025 && (
                <>
                    <button onClick={() => setMobileSearchState(!mobileSearchState)}>
                        <FiSearch />
                    </button>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <FiMenu />
                    </button>
                </>
            )}
            {(screenSize >= 1024 || mobileMenuOpen) && <Nav className={styles.nav} />}
        </header>
    );
};
