import styles from './ViewVote.module.css';
import React from 'react';
import { ScrutinType } from '$types/scrutinTypes';
import { Title } from '$components/text/Title/Title';
import { slugifyNames } from '$helpers/slugify';
import { HiThumbUp, HiThumbDown } from 'react-icons/hi';
import { BsDashLg } from 'react-icons/bs';

export const ViewVote: React.FC<{ scrutin: ScrutinType }> = ({ scrutin }) => {
    const groups = [];
    scrutin.votes.forEach((v) => {
        const group =
            groups.find((g) => (g.name = v.group)) || groups[groups.push({ name: v.group }) - 1];
    });

    return (
        <main className={styles.view}>
            <Title size={'big'} TitleTag="h1">
                {scrutin.title}
            </Title>

            {scrutin.description && <p>{scrutin.description}</p>}

            <section>
                <Title size={'medium-big'} TitleTag="h2">
                    Impact
                </Title>
                <p>
                    Ce projet à été jugé{' '}
                    {scrutin.impactModifier > 0
                        ? 'positif'
                        : scrutin.impactModifier < 0
                        ? 'négatif'
                        : 'neutre'}
                </p>
                <Title size={'medium'} TitleTag="h3">
                    Sources
                </Title>
                <ul>
                    {scrutin.sources.map((s) => (
                        <li key={s}>
                            <a href={s} target="_blank">
                                {s}
                            </a>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <Title size={'medium-big'} TitleTag="h2">
                    Votes
                </Title>
                <ul className={styles.votes}>
                    {scrutin.votes.map((v) => {
                        const slug = slugifyNames(v.firstname, v.lastname);
                        return (
                            <li key={slug}>
                                {v.lastname} {v.firstname} :{' '}
                                {v.vote === 'Pour' ? (
                                    <HiThumbUp />
                                ) : v.vote === 'Contre' ? (
                                    <HiThumbDown />
                                ) : (
                                    <BsDashLg />
                                )}
                            </li>
                        );
                    })}
                </ul>
            </section>
        </main>
    );
};
