import styles from './ViewHomePage.module.css';
import React, { useState } from 'react';
import Head from 'next/head';
import { Loader } from '$components/layout/Loader/Loader';
import { DeputeBlock } from '$components/depute/DeputeBlock/DeputeBlock';
import { SearchForm } from '$components/forms/SearchForm/SearchForm';
import { useRecoilValue } from 'recoil';
import { groupsListState } from '../../atoms/groupsListState';
import { deputesListState } from '../../atoms/deputesListState';

export const ViewHomePage: React.FC = () => {
    const groups = useRecoilValue(groupsListState);
    const deputes = useRecoilValue(deputesListState);
    const [selectedGroup, setSelectedGroup] = useState<string>();

    return (
        <main className={styles.view}>
            <Head>
                <title>Quel député ?</title>
            </Head>

            <SearchForm />

            <h2>Groupes parlementaires</h2>

            {!groups ? (
                <Loader />
            ) : (
                <ul className={styles.groups}>
                    {groups.map((g) => (
                        <li key={g}>
                            <button onClick={() => setSelectedGroup(g)}>{g}</button>
                        </li>
                    ))}
                </ul>
            )}

            {selectedGroup && (
                <>
                    <h3>{selectedGroup}</h3>
                    <ul className={styles.results}>
                        {deputes
                            .filter((d) => d.group === selectedGroup)
                            .map((d) => (
                                <li key={d.id}>
                                    <DeputeBlock isLink depute={d} />
                                </li>
                            ))}
                    </ul>
                </>
            )}
        </main>
    );
};
