import React, { useState } from 'react';
import { Loader } from '$components/layout/Loader/Loader';
import styles from '$views/ViewHomePage/ViewHomePage.module.css';
import { DeputeBlock } from '$components/depute/DeputeBlock/DeputeBlock';
import { Title } from '$components/text/Title/Title';
import { useRecoilValue } from 'recoil';
import { groupsListState } from '../../atoms/groupsListState';
import { deputesListState } from '../../atoms/deputesListState';
import { SearchForm } from '$components/forms/SearchForm/SearchForm';

export const ViewDeputes: React.FC = () => {
    const groups = useRecoilValue(groupsListState);
    const deputes = useRecoilValue(deputesListState);
    const [selectedGroup, setSelectedGroup] = useState<string>();

    return (
        <main>
            <Title size="big" TitleTag="h1">
                Groupes parlementaires
            </Title>

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
            <SearchForm />
        </main>
    );
};
