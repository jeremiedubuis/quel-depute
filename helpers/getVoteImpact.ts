import { DeputeVote } from '$types/deputeTypes';

export const getVoteImpact = (v: DeputeVote) => {
    if (
        (v.impactModifier > 0 && v.vote === 'Pour') ||
        (v.impactModifier < 0 && v.vote === 'Contre')
    )
        return 1;
    if (
        (v.impactModifier > 0 && v.vote === 'Contre') ||
        (v.impactModifier < 0 && v.vote === 'Pour')
    )
        return -1;
    return 0;
};
