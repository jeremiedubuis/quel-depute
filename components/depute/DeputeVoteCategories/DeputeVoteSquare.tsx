import styles from './DeputeVoteCategories.module.css';
import React from 'react';
import { DeputeVote } from '$types/deputeTypes';
import { cn } from '$helpers/cn';

export const DeputeVoteSquare: React.FC<{ vote: DeputeVote; className?: string }> = ({
    vote,
    className,
}) => {
    return (
        <li key={vote.name} className={cn(styles.square, className)}>
            <div className={styles.details}>
                <h4>{vote.name}</h4>
                {vote.vote}
            </div>
        </li>
    );
};
