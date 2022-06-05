import React, { useState } from 'react';
import styles from './ViewDeputes.module.css';
import { DeputeBlock } from '$components/depute/DeputeBlock/DeputeBlock';
import { Title } from '$components/text/Title/Title';
import { useRecoilValue } from 'recoil';
import { deputesListState } from '../../atoms/deputesListState';
import { SearchForm } from '$components/forms/SearchForm/SearchForm';
import { DropDown } from '$components/text/DropDown/DropDown';
import { assemblyColors } from '$components/depute/DeputeBlock/colors';
import { cn } from '$helpers/cn';
import { FiCheck } from 'react-icons/fi';
import { Metas } from '$components/layout/Metas';

export const ViewDeputes: React.FC = () => {
    const deputes = useRecoilValue(deputesListState);
    const [sorting, setSorting] = useState('parti');

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
    const counties = deputes
        .filter((d) => d.current)
        .reduce((acc, d) => {
            const county =
                acc.find((a) => a.county === d.county) ||
                acc[acc.push({ county: d.county, countyId: d.countyId, deputes: [] }) - 1];
            county.deputes.push(d);
            return acc;
        }, [])
        .sort((a, b) => a.countyId - b.countyId);

    return (
        <main>
            <Metas title={`Liste des députés par parti/département | Quel député ?`} />
            <SearchForm small />
            <Title size="big" TitleTag="h1">
                Députés de la XVème législature
            </Title>

            <nav className={styles.tabs}>
                <ul>
                    <li>
                        <button
                            className={cn(sorting === 'parti' && styles.activeSorting)}
                            onClick={() => setSorting('parti')}
                        >
                            Trier par parti {sorting === 'parti' && <FiCheck />}
                        </button>
                    </li>
                    <li>
                        <button
                            className={cn(sorting === 'county' && styles.activeSorting)}
                            onClick={() => setSorting('county')}
                        >
                            Trier par département {sorting === 'county' && <FiCheck />}
                        </button>
                    </li>
                </ul>
            </nav>

            {sorting === 'parti' ? (
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
            ) : (
                <ul className={styles.groups}>
                    {counties.map(({ county, countyId, deputes }) => (
                        <li key={county}>
                            <DropDown
                                buttonStyle={{ background: '#707070' }}
                                className={styles.group}
                                content={
                                    <ul className={styles.deputes}>
                                        {deputes
                                            .sort((a, b) => a.circumscription - b.circumscription)
                                            .map((d) => (
                                                <li key={d.id}>
                                                    <DeputeBlock isLink depute={d} />
                                                </li>
                                            ))}
                                    </ul>
                                }
                            >
                                {countyId} {county}
                            </DropDown>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
};
