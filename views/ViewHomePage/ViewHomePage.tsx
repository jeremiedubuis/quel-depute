import styles from './ViewHomePage.module.css';
import React from 'react';
import Head from 'next/head';
import { SearchForm } from '$components/forms/SearchForm/SearchForm';
import { Metas } from '$components/layout/Metas';

export const ViewHomePage: React.FC = () => {
    return (
        <main className={styles.view}>
            <Metas title={`Quel député ? Comment votre député à voté ?`} />

            <SearchForm />
        </main>
    );
};
