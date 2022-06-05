import styles from './ViewDepute.module.css';
import React from 'react';
import { Depute } from '$types/deputeTypes';
import { HorizontalBars } from '$components/graphs/HorizontalBars/HorizontalBars';
import { SearchForm } from '$components/forms/SearchForm/SearchForm';
import { DeputeVotesSlider } from '$components/depute/DeputeVotesSlider/DeputeVotesSlider';
import { Title } from '$components/text/Title/Title';
import { DeputeGroupBehavior } from '$components/depute/DeputeGroupBehavior/DeputeGroupBehavior';
import { DeputeTop } from '$components/depute/DeputeTop/DeputeTop';
import { Breadcrumb } from '$components/text/Breadcrumb/Breadcrumb';
import { slugify } from '$helpers/slugify';
import { Metas } from '$components/layout/Metas';

export const ViewDepute: React.FC<{ depute: Depute }> = ({ depute }) => {
    const title = `${depute.firstname} ${depute.lastname}`;
    return (
        <main className={styles.view}>
            <Metas
                title={title + ' | Quel député ?'}
                description={`Comment ${title} a-t-il/elle défendu l'environnement, les services publics, le plus précaires et les libertés individuelles ? Est-il/elle la cible d'affaires judiciaires ? Découvrez tout sur votre député sur quel-depute.fr `}
                image={{
                    src: `${process.env.HOST}/${depute.slug}?img=1`,
                    width: '1200px',
                    height: '630px'
                }}
            />
            <SearchForm small />
            <Breadcrumb
                items={[
                    { label: 'Accueil', href: '/' },
                    {
                        label: `Circonscription: ${depute.county} (${depute.circumscription})`,
                        href: `/circonscriptions/${slugify(
                            `${depute.county} ${depute.circumscription}`
                        )}`
                    },
                    { label: `${depute.firstname} ${depute.lastname}` }
                ]}
            />

            <DeputeTop className={styles.depute} depute={depute} noCounty={false} />
            <section>
                <Title size="big">Position sur des scrutins importants</Title>
                <DeputeVotesSlider depute={depute} />
            </section>

            <section>
                <Title size="big">Positionnement politique</Title>
                <DeputeGroupBehavior className={styles.group} depute={depute} />
            </section>
            {/*
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
            </section>*/}

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
                                depute.firstRoundResults.whites
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
