import styles from './ViewHomePage.module.css';
import React from 'react';
import Head from 'next/head';
import { SearchForm } from '$components/forms/SearchForm/SearchForm';

export const ViewHomePage: React.FC = () => {
    return (
        <main className={styles.view}>
            <Head>
                <title>Quel député ?</title>
            </Head>

            <SearchForm />
        </main>
    );
};
