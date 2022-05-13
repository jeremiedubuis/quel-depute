import React from 'react';
import { ScrutinType } from '$types/scrutinTypes';
import { Title } from '$components/text/Title/Title';

export const ViewVote: React.FC<{ scrutin: ScrutinType }> = ({ scrutin }) => {
    return (
        <main>
            <Title size={'big'} TitleTag="h1">
                {scrutin.title}
            </Title>
        </main>
    );
};
