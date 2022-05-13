import React from 'react';
import { Title } from '$components/text/Title/Title';
import { BaseScrutin } from '$types/scrutinTypes';
import Link from 'next/link';

export const ViewVotes: React.FC<{ scrutins: BaseScrutin[] }> = ({ scrutins }) => {
    console.log(scrutins);
    return (
        <main>
            <Title size="big" TitleTag="h1">
                Votes
            </Title>

            <p>
                L'équipe de quel-depute.fr a analysé une liste de scrutins de la 15ème législature
                pour aider à cerner le profil des députés sortants dans le contexte des élections
                législatives de 2022. Vous trouverez ici la liste des scrutins analysés.
            </p>

            <ul>
                {scrutins.map((s) => (
                    <li key={s.number}>
                        <Link href={`/votes/${s.number}`}>{s.title}</Link>
                    </li>
                ))}
            </ul>
        </main>
    );
};
