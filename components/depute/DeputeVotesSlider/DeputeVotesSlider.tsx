import styles from './DeputeVotesSlider.module.css';
import React from 'react';
import { Depute } from '$types/deputeTypes';
import { ReactISlider } from 'react-i-slider';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { cn } from '$helpers/cn';
import { getVoteImpact } from '$helpers/getVoteImpact';

export const DeputeVotesSlider: React.FC<{ depute: Depute }> = ({ depute }) => {
    const votes = depute.votes.filter((vote) => vote.vote !== 'Absent');
    return (
        <ReactISlider
            maxSlides={typeof window !== 'undefined' && window.outerWidth > 1023 ? 3 : 1}
            className={cn(styles.votes, votes.length > 3 && styles.arrows)}
            prev={<FiChevronLeft />}
            next={<FiChevronRight />}
            arrows={votes.length > 3}
        >
            {votes.map((vote) => {
                const impact = getVoteImpact(vote);
                return (
                    <div key={vote.name} className={styles.vote}>
                        <header
                            className={
                                impact === 1
                                    ? styles.positive
                                    : impact === -1
                                    ? styles.negative
                                    : styles.neutral
                            }
                        >
                            {vote.vote}
                        </header>
                        <h3>{vote.name}</h3>
                    </div>
                );
            })}
        </ReactISlider>
    );
};
