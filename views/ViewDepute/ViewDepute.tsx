import React from 'react';
import { Depute } from '$types/deputeTypes';
import Head from 'next/head';
import { HorizontalBars } from '$components/graphs/HorizontalBars/HorizontalBars';

export const ViewDepute: React.FC<{ depute: Depute }> = ({ depute }) => {
    const title = `${depute.firstname} ${depute.lastname}`;
    const meta = {
        image: {
            src: `${process.env.HOST}/${depute.slug}?img=1`,
            width: '1200px',
            height: '630px'
        },
        title
    };

    return (
        <main>
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta property="twitter:title" content={title} />
                <meta property="twitter:image" content={meta.image.src} />
                <meta property="og:image" content={meta.image.src} />
                <meta property="og:image:width" content={meta.image.width} />
                <meta property="og:image:height" content={meta.image.height} />
            </Head>
            <h1>
                {depute.firstname} {depute.lastname}
            </h1>
            <img
                src={
                    process.env.NODE_ENV === 'production'
                        ? `/card/deputes/${depute.slug}.jpg`
                        : `/api/card/${depute.slug}`
                }
                width={504}
            />
            <ul>
                {Object.keys(depute.votes).map((vote) => (
                    <li key={vote}>
                        {vote}: {depute.votes[vote].vote} ({depute.votes[vote].weight})
                    </li>
                ))}
            </ul>
            {depute.firstRoundResults && (
                <>
                    <h2>
                        Résultats du premier tour dans la circonscription: {depute.county} (
                        {depute.circumscription})
                    </h2>
                    <HorizontalBars
                        lines={Object.keys(depute.firstRoundResults.candidates).map((c) => ({
                            title: c,
                            amounts: [depute.firstRoundResults.candidates[c]],
                            total:
                                depute.firstRoundResults.voted -
                                depute.firstRoundResults.void -
                                depute.firstRoundResults.whites
                        }))}
                    />
                </>
            )}
        </main>
    );
};
