import React from 'react';
import { Depute } from '$types/deputeTypes';
import { HorizontalBars } from '$components/graphs/HorizontalBars/HorizontalBars';

export const DeputeGroupBehavior: React.FC<{ depute: Depute; className?: string }> = ({
    depute,
    className
}) => {
    return (
        <HorizontalBars
            className={className}
            tooltip
            lines={[
                {
                    title: 'A voté comme son groupe',
                    amounts: [depute.votedAsGroup],
                    colors: ['#E63847'],
                    total: 100
                },
                {
                    title: 'A voté contre les mesures du gouvernement',
                    amounts: [depute.opposedGovernment],
                    total: depute.governmentLaws,
                    colors: ['#1D3058']
                },
                {
                    title: 'A voté comme la majorité présidentielle',
                    amounts: [depute.supportedGovernment],
                    total: depute.governmentLaws,
                    colors: ['#FFBB00']
                }
            ]}
        />
    );
};
