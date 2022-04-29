import styles from './ViewDepute.module.css';
import React from 'react';
import { Depute } from '$types/deputeTypes';
import Head from 'next/head';
import { HorizontalBars } from '$components/graphs/HorizontalBars/HorizontalBars';
import { SearchForm } from '$components/forms/SearchForm/SearchForm';
import { DeputeVotesSlider } from '$components/depute/DeputeVotesSlider/DeputeVotesSlider';
import { DeputeBlock } from '$components/depute/DeputeBlock/DeputeBlock';
import { Title } from '$components/text/Title/Title';
import { ProgressCircle } from '$components/graphs/ProgressCircle/ProgressCircle';
import { DeputeVoteCategories } from '$components/depute/DeputeVoteCategories/DeputeVoteCategories';
import { cn } from '$helpers/cn';
import { DeputeGroupBehavior } from '$components/depute/DeputeGroupBehavior/DeputeGroupBehavior';

export const ViewDepute: React.FC<{ depute: Depute }> = ({ depute }) => {
    const title = `${depute.firstname} ${depute.lastname}`;
    const meta = {
        image: {
            src: `${process.env.HOST}/${depute.slug}?img=1`,
            width: '1200px',
            height: '630px',
        },
        title,
    };

    return (
        <main className={styles.view}>
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta property="twitter:title" content={title} />
                <meta property="twitter:image" content={meta.image.src} />
                <meta property="og:image" content={meta.image.src} />
                <meta property="og:image:width" content={meta.image.width} />
                <meta property="og:image:height" content={meta.image.height} />
            </Head>

            <SearchForm />
            <section>
                <div className={styles.content}>
                    <DeputeBlock depute={depute} TitleTag="h1" />
                    <DeputeVoteCategories className={styles.right} depute={depute} />
                </div>
            </section>
            <section>
                <Title size="big">Position sur des scrutins importants</Title>
                <DeputeVotesSlider depute={depute} />
            </section>

            <section>
                <Title size="big">Positionnement politique</Title>
                <DeputeGroupBehavior className={styles.group} depute={depute} />
            </section>

            <section className={styles.chances}>
                <Title size="big">Probabilité de réélection</Title>
                <div className={styles.content}>
                    <ProgressCircle percentage={75} />
                    <div className={cn(styles.text, styles.right)}>
                        <Title size="big" TitleTag="h3">
                            Méthodologie
                        </Title>

                        <p>
                            Cette information est donnée à titre indicatif selon une méthode prenant
                            en compte les résultats du premier tour de l'élection présidentielle de
                            2022 dans la criconscription, les résultats des scrutins intermédiaires
                            iansi qu'une prime au sortant tout en prenant en compte l'abstention.
                        </p>
                    </div>
                </div>
            </section>

            {depute.firstRoundResults && (
                <>
                    <Title size="big">
                        Résultats du premier tour dans la circonscription: {depute.county} (
                        {depute.circumscription})
                    </Title>
                    <HorizontalBars
                        lines={Object.keys(depute.firstRoundResults.candidates).map((c) => ({
                            title: c,
                            amounts: [depute.firstRoundResults.candidates[c]],
                            total:
                                depute.firstRoundResults.voted -
                                depute.firstRoundResults.void -
                                depute.firstRoundResults.whites,
                        }))}
                    />
                </>
            )}
            {/*<img
                src={
                    process.env.NODE_ENV === 'production'
                        ? `/card/deputes/${depute.slug}.jpg`
                        : `/api/card/${depute.slug}`
                }
                width={504}
            />*/}
        </main>
    );
};
