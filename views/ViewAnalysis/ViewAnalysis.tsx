import React, { useEffect, useState } from 'react';
import { HorizontalBars } from '$components/graphs/HorizontalBars/HorizontalBars';

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
const colors = [
    'orange',
    'red',
    'blue',
    'darkblue',
    'green',
    'cyan',
    'darkred',
    'lightred',
    'lightblue',
    'pink',
    'grey',
    'purple'
];

const groups = {
    'Gauche élargie': ['MÉLENCHON', 'JADOT', 'ROUSSEL', 'HIDALGO', 'POUTOU'],
    Droite: ['MACRON', 'PÉCRESSE'],
    'Extrême droite': ['LE PEN', 'ZEMMOUR']
};

export const ViewAnalysis: React.FC = () => {
    const [roundResults1, setRoundResults1] = useState<{
        [key: string]: {
            [key: string]: number;
        };
    }>();

    useEffect(() => {
        fetch('/json/circumscription_results_1st_round.json')
            .then((r) => r.json())
            .then((r) => {
                setRoundResults1(
                    r.reduce((acc, a) => {
                        acc[a.county + ' ' + a.circumscription] = keys.reduce((acc, curr) => {
                            acc[curr] = (a[curr] / a.Exprimes) * 100;
                            return acc;
                        }, {});
                        return acc;
                    }, {})
                );
            });
    }, []);

    let groupLines;
    let groupRecap;

    if (roundResults1) {
        groupLines = Object.keys(roundResults1).map((title) => ({
            title,
            amounts: Object.keys(groups).map((group) =>
                groups[group].reduce((acc, k) => acc + roundResults1[title][k], 0)
            ),
            total: 100
        }));
        groupRecap = Object.keys(groups).reduce((acc, curr, i) => {
            acc[curr] = groupLines.reduce(
                (acc, curr) => {
                    const max = Math.max(...curr.amounts);
                    const maxIndex = curr.amounts.indexOf(max);
                    acc.dominated = acc.dominated + (i === maxIndex ? 1 : 0);
                    return acc;
                },
                { dominated: 0, totalDiffsFirstSecond: 0 }
            );
            return acc;
        }, {});
        console.log(groupRecap);
    }

    return (
        <main>
            {groupLines && (
                <>
                    <h2>Par familles politiques</h2>
                    <HorizontalBars
                        lines={groupLines}
                        tooltip
                        labels={Object.keys(groups)}
                        colors={['red', 'blue', 'darkblue']}
                    />
                    <h2>Par candidat</h2>
                    <HorizontalBars
                        lines={Object.keys(roundResults1).map((title) => ({
                            title,
                            amounts: keys.map((k) => roundResults1[title][k]),
                            total: 100
                        }))}
                        tooltip
                        labels={keys}
                        colors={colors}
                    />
                </>
            )}
        </main>
    );
};
