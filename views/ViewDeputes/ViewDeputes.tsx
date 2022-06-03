import React from 'react';
import styles from './ViewDeputes.module.css';
import { DeputeBlock } from '$components/depute/DeputeBlock/DeputeBlock';
import { Title } from '$components/text/Title/Title';
import { useRecoilValue } from 'recoil';
import { deputesListState } from '../../atoms/deputesListState';
import { SearchForm } from '$components/forms/SearchForm/SearchForm';
import { DropDown } from '$components/text/DropDown/DropDown';
import { assemblyColors } from '$components/depute/DeputeBlock/colors';

export const ViewDeputes: React.FC = () => {
    const deputes = useRecoilValue(deputesListState);

    console.log(deputes.filter((d) => d.current));
    const groups = deputes
        .filter((d) => d.current)
        .reduce((acc, d) => {
            const g =
                acc.find((a) => a.name === d.group) ||
                acc[acc.push({ name: d.group, deputes: [] }) - 1];
            g.deputes.push(d);
            return acc;
        }, [])
        .sort((a, b) => b.deputes.length - a.deputes.length);

    return (
        <main>
            <SearchForm small />
            <Title size="big" TitleTag="h1">
                Députés de la XVème législature
            </Title>

            {
                <ul className={styles.groups}>
                    {groups.map((g) => (
                        <li key={g.name}>
                            <DropDown
                                buttonStyle={{ background: assemblyColors[g.name] }}
                                className={styles.group}
                                content={
                                    <ul className={styles.deputes}>
                                        {g.deputes.map((d) => (
                                            <li key={d.id}>
                                                <DeputeBlock isLink depute={d} />
                                            </li>
                                        ))}
                                    </ul>
                                }
                            >
                                {g.name} ({g.deputes.length})
                            </DropDown>
                        </li>
                    ))}
                </ul>
            }
        </main>
    );
};
