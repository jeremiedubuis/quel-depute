import styles from './DeputeVote.module.css';
import React from 'react';
import { Depute } from '$types/deputeTypes';
import { ReactISlider } from 'react-i-slider';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { cn } from '$helpers/cn';

export const DeputeVotes: React.FC<{ depute: Depute }> = ({ depute }) => {
    const votes = Object.keys(depute.votes).filter((vote) => depute.votes[vote].vote !== 'Absent');
    return (
        <ReactISlider
            maxSlides={3}
            className={cn(styles.votes, votes.length > 3 && styles.arrows)}
            prev={<FiChevronLeft />}
            next={<FiChevronRight />}
            arrows={votes.length > 3}
        >
            {votes.map((vote) => (
                <div key={vote} className={styles.vote}>
                    <header
                        className={
                            depute.votes[vote].vote === 'Pour'
                                ? styles.for
                                : depute.votes[vote].vote === 'Contre'
                                ? styles.against
                                : styles.abstained
                        }
                    >
                        {depute.votes[vote].vote}
                    </header>
                    <h3>{vote}</h3>
                </div>
            ))}
        </ReactISlider>
    );
};
