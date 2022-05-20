import styles from './DeputeVoteCategories.module.css';
import React from 'react';
import { Depute, DeputeVote } from '$types/deputeTypes';
import { cn } from '$helpers/cn';
import { DeputeVoteSquare } from '$components/depute/DeputeVoteCategories/DeputeVoteSquare';
import { getVoteImpact } from '$helpers/getVoteImpact';

export const DeputeVoteCategories: React.FC<{ depute: Depute; className?: string }> = ({
    depute,
    className,
}) => {
    const categories = depute.votes.reduce((acc, curr) => {
        if (!curr.category) return acc;
        let category = acc.find(({ category }) => category === curr.category);
        if (!category)
            category =
                acc[
                    acc.push({
                        category: curr.category,
                        votes: [],
                    }) - 1
                ];
        category.votes.push(curr);

        return acc;
    }, []);

    return (
        <ul className={cn(className)}>
            {categories
                .filter((c) => c.votes.length > 5)
                .map((c) => {
                    const positives: DeputeVote[] = [];
                    const negatives: DeputeVote[] = [];
                    const neutrals: DeputeVote[] = [];
                    c.votes.forEach((v) => {
                        const impact = getVoteImpact(v);
                        if (impact === 1) return positives.push(v);
                        if (impact === -1) return negatives.push(v);
                        return neutrals.push(v);
                    });
                    return (
                        <li key={c.category}>
                            <h3>{c.category}</h3>
                            <ul
                                className={styles.votes}
                                style={{
                                    gridTemplateRows: `repeat(${c.votes.length > 26 ? 3 : 2}, 1fr)`,
                                }}
                            >
                                {positives.map((v) => (
                                    <DeputeVoteSquare
                                        lastname={depute.lastname}
                                        key={v.name}
                                        vote={v}
                                        className={styles.for}
                                    />
                                ))}
                                {neutrals.map((v) => (
                                    <DeputeVoteSquare
                                        lastname={depute.lastname}
                                        key={v.name}
                                        vote={v}
                                    />
                                ))}
                                {negatives.map((v) => (
                                    <DeputeVoteSquare
                                        lastname={depute.lastname}
                                        key={v.name}
                                        vote={v}
                                        className={styles.against}
                                    />
                                ))}
                            </ul>
                        </li>
                    );
                })}
        </ul>
    );
};
