import styles from './DeputeVoteCategories.module.css';
import React from 'react';
import { DeputeVote } from '$types/deputeTypes';
import { cn } from '$helpers/cn';
import { AiFillWarning } from 'react-icons/ai';

export const DeputeVoteSquare: React.FC<{
    lastname: string;
    vote: DeputeVote;
    className?: string;
}> = ({ lastname, vote, className }) => {
    return (
        <li key={vote.name} className={cn(styles.block, className)}>
            <div className={styles.square} />
            <div className={styles.details}>
                <h4>{vote.name}</h4>
                {vote.vote}
            </div>
            {vote.notes?.includes(lastname) && (
                <div className={styles.warning}>
                    <AiFillWarning />
                    <div className={styles.details}>
                        <h4>Mises au point</h4>
                        <div dangerouslySetInnerHTML={{ __html: vote.notes }} />
                    </div>
                </div>
            )}
        </li>
    );
};