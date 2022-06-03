import styles from './ViewCircumscription.module.css';
import React, { useEffect } from 'react';
import { CircumscriptionType } from '$types/circumscriptionTypes';
import { Title } from '$components/text/Title/Title';
import { DeputeBlock } from '$components/depute/DeputeBlock/DeputeBlock';
import { HorizontalBars } from '$components/graphs/HorizontalBars/HorizontalBars';
import { Button } from '$components/buttons/Button/Button';
import { slugify, slugifyNames } from '$helpers/slugify';
import { Depute } from '$types/deputeTypes';
import { DeputeTop } from '$components/depute/DeputeTop/DeputeTop';
import { SearchForm } from '$components/forms/SearchForm/SearchForm';
import { Breadcrumb } from '$components/text/Breadcrumb/Breadcrumb';
import { offset } from '$helpers/dom/offset';
import Link from 'next/link';

const keys = [
    'MACRON',
    'MÉLENCHON',
    'LE PEN',
    'ZEMMOUR',
    'JADOT',
    'PÉCRESSE',
    'ARTHAUD',
    'POUTOU',
    'DUPONT-AIGNAN',
    'HIDALGO',
    'LASSALLE',
    'ROUSSEL'
];
const colors = {
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
    console.log(_offset);
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
    return (
        <main className={styles.view}>
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
                            <a href="#candidats" onClick={onAnchorClick}>
                                Candidats
                            </a>
                        </li>
                        <li>
                            <a href="#resultats" onClick={onAnchorClick}>
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
            >
                <Button
                    className={styles.detailsButton}
                    href={`/deputes/${slugifyNames(depute.firstname, depute.lastname)}`}
                >
                    En savoir plus
                </Button>
            </DeputeTop>

            <section id="candidats">
                <Title size={'big'}>Candidats</Title>
                <ul className={styles.candidates}>
                    {circumscription.candidates
                        .sort((a, b) => a.lastname.localeCompare(b.lastname))
                        .map((c) => (
                            <li key={c.lastname}>
                                <DeputeBlock
                                    className={styles.candidate}
                                    depute={c}
                                    noCounty
                                    isLink={false}
                                    noPicture
                                />
                            </li>
                        ))}
                </ul>
            </section>

            <section id="resultats">
                <Title size={'big'}>Resultats du 1er tour des présidentielles</Title>

                <HorizontalBars
                    lines={Object.keys(circumscription.results.firstRound.candidates).map(
                        (title, i) => ({
                            title,
                            amounts: [circumscription.results.firstRound.candidates[title]],
                            total: circumscription.results.firstRound.expressed,
                            colors: [colors[title]]
                        })
                    )}
                    tooltip
                />
                <Title size={'big'}>Resultats du 1nd tour des présidentielles</Title>

                <HorizontalBars
                    lines={Object.keys(circumscription.results.secondRound.candidates).map(
                        (title, i) => ({
                            title,
                            amounts: [circumscription.results.secondRound.candidates[title]],
                            total: circumscription.results.secondRound.expressed,
                            colors: [colors[title]]
                        })
                    )}
                    tooltip
                />
            </section>
        </main>
    );
};
