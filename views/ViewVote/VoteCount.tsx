import React from 'react'
import {ScrutinVote} from "$types/scrutinTypes";

export const VoteCount: React.FC<{votes:ScrutinVote[]}> = ({ votes }) => {
    return <>
        (Pour: {votes.reduce((acc, v) => v.vote === 'Pour' ? acc+1 : acc , 0)})</>
}