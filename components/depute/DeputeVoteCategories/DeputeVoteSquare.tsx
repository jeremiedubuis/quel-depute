import styles from './DeputeVoteCategories.module.css';
import React from 'react';
import { DeputeVote } from '$types/deputeTypes';
import { cn } from '$helpers/cn';
import { AiFillWarning } from 'react-icons/ai';
import { Tooltip } from '$components/text/Tooltip/Tooltip';
import { Button } from '$components/buttons/Button/Button';

export const DeputeVoteSquare: React.FC<{
    lastname: string;
    vote: DeputeVote;
    className?: string;
}> = ({ lastname, vote, className }) => {
    return (
        <li key={vote.name} className={cn(styles.block, className)}>
            <Tooltip
                className={styles.square}
                content={
                    <div className={styles.details}>
                        <h4>{vote.name}</h4>
                        <p>{vote.vote}</p>
                        <Button href={`/votes/${vote.number}`}>En savoir plus</Button>
                    </div>
                }
            />

            {vote.notes?.includes(lastname) && (
                <Tooltip
                    className={styles.warning}
                    content={
                        <>
                            <h4>Mises au point</h4>
                            <div dangerouslySetInnerHTML={{ __html: vote.notes }} />
                        </>
                    }
                >
                    <AiFillWarning />
                </Tooltip>
            )}
        </li>
    );
};
