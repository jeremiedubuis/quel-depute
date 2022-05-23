import React from 'react';
import {CircumscriptionType} from "$types/circumscriptionTypes";
import {Title} from "$components/text/Title/Title";
import {DeputeBlock} from "$components/depute/DeputeBlock/DeputeBlock";

export const ViewCircumscription: React.FC<{circumscription: CircumscriptionType}> = ({ circumscription }) => {

    return <main>
        <Title size={'biggest'} TitleTag="h1">Circonscription {circumscription.name} {circumscription.number}</Title>

        <section>
        <Title size={'big'}>Candidats</Title>
            <ul>
                {circumscription.candidates.map(c => <li key={c.lastname}><DeputeBlock depute={c} noCounty isLink={!c.noPicture}/></li>)}
            </ul>
        </section>
    </main>

}