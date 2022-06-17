import styles from './ViewCircumscription.module.css';
import React, { useEffect } from 'react';
import { CircumscriptionType } from '$types/circumscriptionTypes';
import { Title } from '$components/text/Title/Title';
import { DeputeBlock } from '$components/depute/DeputeBlock/DeputeBlock';
import { HorizontalBars } from '$components/graphs/HorizontalBars/HorizontalBars';
import { Button } from '$components/buttons/Button/Button';
import { slugifyNames } from '$helpers/slugify';
import { Candidate, Depute } from '$types/deputeTypes';
import { DeputeTop } from '$components/depute/DeputeTop/DeputeTop';
import { SearchForm } from '$components/forms/SearchForm/SearchForm';
import { Breadcrumb } from '$components/text/Breadcrumb/Breadcrumb';
import { offset } from '$helpers/dom/offset';
import Link from 'next/link';
import { Metas } from '$components/layout/Metas';
import { colors, groups } from '$components/depute/DeputeBlock/colors';
import { NuanceBlock } from '$components/depute/DeputeBlock/NuanceBlock';
import { cn } from '$helpers/cn';

const presColors = {
    'Emmanuel Macron': 'orange',
    'Jean-Luc Mélenchon': 'red',
    'Marine Le Pen': 'blue',
    'Eric Zemmour': 'black',
    'Nicolas Dupont-Aignan': 'darkblue',
    'Yannick Jadot': 'green',
    'Valérie Pécresse': 'cyan',
    'Nathalie Arthaud': 'darkred',
    'Anne Hidalgo': 'pink',
    'Jean Lasalle': 'lightblue',
    'Fabien Roussel': 'lightred',
    'Phillipe Poutou': '#4B0115'
};

const onAnchorClick = (e) => {
    e.preventDefault();
    const targetId = e.currentTarget.href.split('/').pop().replace('#', '');
    scrollToAnchor(targetId);
};

const scrollToAnchor = (targetId: string) => {
    const _offset = document.getElementById('circumscription-header').offsetHeight;
    const { top } = offset(document.getElementById(targetId));
    window.location.hash = targetId;
    window.scrollTo(0, top - _offset);
};
export const ViewCircumscription: React.FC<{
    circumscription: CircumscriptionType;
    depute: Depute;
}> = ({ circumscription, depute }) => {
    useEffect(() => {
        if (window.location.hash) {
            setTimeout(() => {
                scrollToAnchor(window.location.hash.replace('#', ''));
            }, 500);
        }
    }, []);

    const firstRound = circumscription.results['2022'].firstRound;
    const qualified = circumscription.candidates
        .filter((c) => c.qualified)
        .sort((a, b) => a.lastname.localeCompare(b.lastname));
    return (
        <main className={styles.view}>
            <Metas
                title={`Circonscription ${circumscription.number} (${circumscription.name}) | Quel député ?`}
                description={`Qui se présente dans la circonscription ${circumscription.number} (${circumscription.name}) ? Qui est le député sortant ? Comment a-il-voté ? Découvrez le sur quel-depute.fr !`}
                image={{
                    src: `${process.env.NEXT_PUBLIC_HOST}/card/deputes/${depute.slug}.jpg`,
                    width: '1200px',
                    height: '630px'
                }}
            />
            <SearchForm small />
            <Breadcrumb
                items={[
                    { label: 'Accueil', href: '/' },
                    {
                        label: `Circonscription: ${depute.county} (${depute.circumscription})`
                    }
                ]}
            />
            <header id="circumscription-header" className={styles.header}>
                <Title size={'biggest'} TitleTag="h1">
                    Circonscription {circumscription.name} {circumscription.number}
                </Title>
                <nav>
                    <ul>
                        <li>
                            <Link href="#depute">
                                <a onClick={onAnchorClick}>Député sortant</a>
                            </Link>
                        </li>
                        <li>
                            <a href="#resultats-1er-tour" onClick={onAnchorClick}>
                                Résultats législatives
                            </a>
                        </li>
                        <li>
                            <a href="#resultats-presi" onClick={onAnchorClick}>
                                Résultats présidentielles
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>

            <DeputeTop
                id="depute"
                title="Député sortant"
                depute={depute}
                className={styles.previous}
                noCounty={true}
            >
                <Button
                    className={styles.detailsButton}
                    href={`/deputes/${slugifyNames(depute.firstname, depute.lastname)}`}
                >
                    En savoir plus
                </Button>
            </DeputeTop>

            <section id="resultats-1er-tour">
                <Title size={'big'} className={styles.title}>
                    Premier tour
                </Title>
                <ul className={styles.stats}>
                    <li>
                        Abstention:{' '}
                        {(100 - (firstRound.expressed / firstRound.registered) * 100).toFixed(2)}%{' '}
                        <span>
                            ({firstRound.expressed} suffrages exprimés / {firstRound.registered}{' '}
                            inscrits)
                        </span>{' '}
                    </li>
                    <li>
                        Votes blancs:{' '}
                        {((firstRound.whites / firstRound.expressed) * 100).toFixed(2)}%{' '}
                        <span>({firstRound.whites})</span>
                    </li>
                    <li>
                        Votes nuls: {((firstRound.void / firstRound.expressed) * 100).toFixed(2)}%{' '}
                        <span>({firstRound.void})</span>
                    </li>
                    <li>
                        <HorizontalBars
                            className={styles.results}
                            lines={circumscription.candidates
                                .sort((a, b) => a.firstRound - b.firstRound)
                                .map((c, i) => ({
                                    title: (
                                        <div>
                                            <div className={styles.name}>
                                                {c.firstname} {c.lastname}{' '}
                                                <span>
                                                    {(
                                                        (c.firstRound / firstRound.expressed) *
                                                        100
                                                    ).toFixed(2)}
                                                    %
                                                </span>
                                            </div>
                                            <NuanceBlock candidate={c} />
                                        </div>
                                    ),
                                    amounts: [c.firstRound],
                                    total: firstRound.expressed,
                                    colors: [colors[c.nuanceComputed]]
                                }))}
                            tooltip
                        />
                    </li>
                </ul>
            </section>

            <section id="candidats-quali">
                <Title size={'big'} className={styles.title}>
                    {qualified.length > 1
                        ? 'Candidat(e)s qualifié(e)s pour le second tour'
                        : 'Candidat(e) élu(e) au premier tour'}
                </Title>
                <ul className={styles.candidates}>
                    {qualified.map((c) => (
                        <li key={c.lastname}>
                            <DeputeBlock
                                className={cn(styles.candidate)}
                                depute={c}
                                noCounty
                                isLink={false}
                                noPicture
                            />
                        </li>
                    ))}
                </ul>
            </section>

            <section id="candidats-eli">
                <Title size={'big'} className={styles.title}>
                    Candidats éliminés
                </Title>
                <ul className={styles.candidates}>
                    {circumscription.candidates
                        .filter((c) => !c.qualified)
                        .sort((a, b) => a.lastname.localeCompare(b.lastname))
                        .map((c) => (
                            <li key={c.lastname}>
                                <DeputeBlock
                                    className={cn(styles.candidate, styles.disqualified)}
                                    depute={c}
                                    noCounty
                                    isLink={false}
                                    noPicture
                                />
                            </li>
                        ))}
                </ul>
            </section>

            <section id="resultats-presi">
                <Title size={'big'}>Resultats du 1er tour des présidentielles</Title>

                <HorizontalBars
                    lines={Object.keys(circumscription.results['2017'].firstRound.candidates).map(
                        (title, i) => ({
                            title,
                            amounts: [circumscription.results['2017'].firstRound.candidates[title]],
                            total: circumscription.results['2017'].firstRound.expressed,
                            colors: [presColors[title]]
                        })
                    )}
                    tooltip
                />
                <Title size={'big'}>Resultats du 2nd tour des présidentielles</Title>

                <HorizontalBars
                    lines={Object.keys(circumscription.results['2017'].secondRound.candidates).map(
                        (title, i) => ({
                            title,
                            amounts: [
                                circumscription.results['2017'].secondRound.candidates[title]
                            ],
                            total: circumscription.results['2017'].secondRound.expressed,
                            colors: [presColors[title]]
                        })
                    )}
                    tooltip
                />
            </section>
        </main>
    );
};
