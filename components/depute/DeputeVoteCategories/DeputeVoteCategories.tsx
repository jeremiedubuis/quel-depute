import styles from './DeputeVoteCategories.module.css';
import React from 'react';
import { Depute } from '$types/deputeTypes';
import { cn } from '$helpers/cn';

export const DeputeVoteCategories: React.FC<{ depute: Depute; className?: string }> = ({
    depute,
    className
}) => {
    const categories = depute.votes.reduce((acc, curr) => {
        if (!curr.category) return acc;
        let category = acc.find(({ category }) => category === curr.category);
        if (!category)
            category =
                acc[
                    acc.push({
                        category: curr.category,
                        votes: []
                    }) - 1
                ];
        category.votes.push(curr);

        return acc;
    }, []);
    return (
        <ul className={cn(className)}>
            {categories.map((c) => (
                <li key={c.category}>
                    <h3>{c.category}</h3>
                    <ul className={styles.votes}>
                        {c.votes
                            .sort((a, b) =>
                                a.vote === 'Pour' && b.vote !== 'Pour'
                                    ? -1
                                    : b.vote === 'Pour' && a.vote !== 'Pour'
                                    ? 1
                                    : a.vote === 'Contre' && b.vote !== 'Contre'
                                    ? 1
                                    : b.vote === 'Contre' && a.vote !== 'Contre'
                                    ? -1
                                    : 0
                            )
                            .map((v) => (
                                <li
                                    key={v.name}
                                    className={cn(
                                        styles.square,
                                        v.vote === 'Pour' && styles.for,
                                        v.vote === 'Contre' && styles.against
                                    )}
                                >
                                    <div className={styles.details}>
                                        <h4>{v.name}</h4>
                                        {v.vote}
                                    </div>
                                </li>
                            ))}
                    </ul>
                </li>
            ))}
        </ul>
    );
};
