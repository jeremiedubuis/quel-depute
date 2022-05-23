import styles from './ViewCircumscription.module.css'
import React from 'react';
import {CircumscriptionType} from "$types/circumscriptionTypes";
import {Title} from "$components/text/Title/Title";
import {DeputeBlock} from "$components/depute/DeputeBlock/DeputeBlock";
import {HorizontalBars} from "$components/graphs/HorizontalBars/HorizontalBars";

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
    "Emmanuel Macron": 'orange',
    "Jean-Luc Mélenchon": 'red',
    "Marine Le Pen": 'blue',
    "Eric Zemmour": 'black',
    'Nicolas Dupont-Aignan': 'darkblue',
    'Yannick Jadot': 'green',
    'Valérie Pécresse': 'cyan',
    'Nathalie Arthaud':'darkred',
    'Anne Hidalgo': 'pink',
    'Jean Lasalle': 'lightblue',
    'Fabien Roussel':'lightred',
    'Phillipe Poutou': '#4B0115'
};
export const ViewCircumscription: React.FC<{circumscription: CircumscriptionType}> = ({ circumscription }) => {

    return <main className={styles.view}>
        <Title size={'biggest'} TitleTag="h1">Circonscription {circumscription.name} {circumscription.number}</Title>

        <section>
        <Title size={'big'}>Candidats</Title>
            <ul className={styles.candidates}>
                {circumscription.candidates.sort((a, b) => a.lastname.localeCompare(b.lastname)).map(c => <li key={c.lastname}><DeputeBlock depute={c} noCounty isLink={!c.noPicture}/></li>)}
            </ul>
        </section>

        <Title size={'big'}>Resultats du 1er tour des présidentielles</Title>

        <HorizontalBars
            lines={Object.keys(circumscription.results.firstRound.candidates).map((title, i) => ({
                title,
                amounts: [circumscription.results.firstRound.candidates[title] ],
                total: circumscription.results.firstRound.expressed,
                colors: [colors[title]]
            }))}
            tooltip
            labels={keys}
        />
    </main>

}