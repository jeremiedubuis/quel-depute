import styles from './ViewHomePage.module.css';
import React from 'react';
import Head from 'next/head';
import { SearchForm } from '$components/forms/SearchForm/SearchForm';
import { Metas } from '$components/layout/Metas';

export const ViewHomePage: React.FC = () => {
    return (
        <main className={styles.view}>
            <Metas
                title={`Quel député ? Comment votre député a voté ?`}
                description={`Sur quel-depute.fr vous découvrirez comment les députés ont voté sur des scutins représentatifs sur les thèmes clés des inégalités, de l'environnement, des libertés et des services publics. Vous pourrez consulter la liste des candidats de votre circonscription et la comparer aux résultats des élections précédentes.`}
            />

            <SearchForm />
        </main>
    );
};
