import React from 'react';
import { ScrutinVote } from '$types/scrutinTypes';

export const VoteCount: React.FC<{ votes: ScrutinVote[] }> = ({ votes }) => {
    return (
        <>
            (Pour: {votes.reduce((acc, v) => (v.vote === 'Pour' ? acc + 1 : acc), 0)} | Contre:{' '}
            {votes.reduce((acc, v) => (v.vote === 'Contre' ? acc + 1 : acc), 0)}) | Abstention:{' '}
            {votes.reduce((acc, v) => (v.vote === 'Abstention' ? acc + 1 : acc), 0)})
        </>
    );
};
