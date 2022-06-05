import React from 'react';
import { Title } from '$components/text/Title/Title';
import { BaseScrutin } from '$types/scrutinTypes';
import Link from 'next/link';

export const ViewVotes: React.FC<{ scrutins: BaseScrutin[] }> = ({ scrutins }) => {
    const groups = scrutins.reduce((acc, curr) => {
        if (!acc[curr.category]) acc[curr.category] = [];
        acc[curr.category].push(curr);
        return acc;
    }, {});
    return (
        <main>
            <Title size="biggest" TitleTag="h1">
                Votes
            </Title>

            <p>
                L'équipe de quel-depute.fr a analysé une liste de scrutins de la 15ème législature
                pour aider à cerner le profil des députés sortants dans le contexte des élections
                législatives de 2022. Vous trouverez ici la liste des scrutins analysés.
            </p>

            <Title size="big" TitleTag="h2">
                Méthodologie
            </Title>
            <p>
                Ces scrutins ont été jugés positifs ou négatifs en fonction de critères de progrès
                sociaux, d'écologie, de défense et extension des services publics et de protection
                des libertés individuelles et collectives.
                <br />
                Ces choix sont justifiés par des sources lorsque l'effet des mesures n'est pas
                évident. Des associations comme la Fondation Abbé Pierre, Greenpeace, la Ligue des
                Droits de l'Homme ou encore France Nature Environnement... Où même le défeuser des
                droits quand il émet un avis défavorable envers une mesure du gouvernement qui l'a
                nommé.
            </p>
            <Title size="big" TitleTag="h2">
                Difficultés
            </Title>

            <p>
                La difficulté de cet exercice réside dans propension du gouvernement à recourir aux
                ordonnances et à la procédure accélérée sur les scrutins ce qui ne permet pas de
                distinguer les articles et ammendements d'un texte.
                <br />
                Ainsi certains textes portent des articles positifs et d'autres négatifs, mais nous
                sommes contraint de les traiter en bloc. Ceci est également vrai pour les députés
                eux mêmes qui sont parfois contraints de voter des textes portant des articles
                qu'ils ne soutiennent pas ou à l'inverse de votrer contre des projets portant des
                articles qu'ils défendent.
            </p>
            <ul>
                {Object.keys(groups).map((g) => (
                    <li key={g}>
                        <Title size="medium-big" TitleTag="h4">
                            {g}
                        </Title>
                        <ul>
                            {groups[g].map((s) => (
                                <li key={s.number}>
                                    <Link href={`/votes/${s.number}`}>{s.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </main>
    );
};
