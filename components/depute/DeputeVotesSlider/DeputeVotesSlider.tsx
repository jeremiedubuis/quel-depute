import styles from './DeputeVotesSlider.module.css';
import React from 'react';
import { Depute } from '$types/deputeTypes';
import { ReactISlider } from 'react-i-slider';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { cn } from '$helpers/cn';

export const DeputeVotesSlider: React.FC<{ depute: Depute }> = ({ depute }) => {
    const votes = depute.votes.filter((vote) => vote.vote !== 'Absent');
    return (
        <ReactISlider
            maxSlides={3}
            className={cn(styles.votes, votes.length > 3 && styles.arrows)}
            prev={<FiChevronLeft />}
            next={<FiChevronRight />}
            arrows={votes.length > 3}
        >
            {votes.map((vote) => (
                <div key={vote.name} className={styles.vote}>
                    <header
                        className={
                            vote.vote === 'Pour'
                                ? styles.for
                                : vote.vote === 'Contre'
                                ? styles.against
                                : styles.abstained
                        }
                    >
                        {vote.vote}
                    </header>
                    <h3>{vote.name}</h3>
                </div>
            ))}
        </ReactISlider>
    );
};
