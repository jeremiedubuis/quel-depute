import styles from './DeputeVoteCategories.module.css';
import React, { useEffect, useRef, useState } from 'react';
import { Depute, DeputeVote } from '$types/deputeTypes';
import { cn } from '$helpers/cn';
import { DeputeVoteSquare } from '$components/depute/DeputeVoteCategories/DeputeVoteSquare';
import { getVoteImpact } from '$helpers/getVoteImpact';
import { useRecoilValue } from 'recoil';
import { screenSizeState } from '../../../atoms/screeSizeState';

export const DeputeVoteCategories: React.FC<{ depute: Depute; className?: string }> = ({
    depute,
    className
}) => {
    const size = useRecoilValue(screenSizeState);
    const [squares, setSquares] = useState<number>((size - 100) / 50);
    const ref = useRef<HTMLUListElement>();

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

    useEffect(() => {
        setSquares(Math.floor((ref.current.offsetWidth - 20) / 50));
    }, [size]);

    return (
        <ul className={cn(className)} ref={ref}>
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
                                key={c.category + squares}
                                style={{
                                    gridTemplateRows: `repeat(${Math.ceil(
                                        c.votes.length / squares
                                    )}, 1fr)`
                                }}
                            >
                                {positives.map((v) => (
                                    <DeputeVoteSquare
                                        lastname={depute.lastname}
                                        vote={v}
                                        className={styles.for}
                                    />
                                ))}
                                {neutrals.map((v) => (
                                    <DeputeVoteSquare lastname={depute.lastname} vote={v} />
                                ))}
                                {negatives.map((v) => (
                                    <DeputeVoteSquare
                                        lastname={depute.lastname}
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
