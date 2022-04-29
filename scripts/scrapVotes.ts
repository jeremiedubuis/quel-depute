import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Depute, VoteValue } from '$types/deputeTypes';

export type Scrutin = {
    'N° scrutin': number;
    'Nom de la loi': string;
    'Adoptée/Rejetée': 'REJETÉE' | 'ADOPTÉE';
    'Date du vote JJ/MM/AAAA': string;
    'Catégorie (écologie, économie...)': 'Écologie' | 'Droits humains' | 'Éducation' | 'Pauvreté';
    'Description simplifiée de la loi': string;
    'Loi +/- pr la cause': 'Positif' | 'Négatif';
    'Avis organisme référent': string;
    'Nom organisme référent': string;
    'Sources Medias': string;
    'Poids Politique (Majeur, Intermediaire, mineur)': 'Majeur' | 'Mineur' | 'Intermédiaire';
    Initiative: 'Gouvernement' | 'LREM' | 'Opposition' | 'Transpartisane';
};

export const scrapVotes = async (
    scrutin: Scrutin,
    deputes: Depute[]
): Promise<{ [fullname: string]: VoteValue }> => {
    const html = await axios
        .get(
            `https://www2.assemblee-nationale.fr/scrutins/detail/(legislature)/15/(num)/${scrutin['N° scrutin']}`
        )
        .then((r) => r.data);

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const votes = {};
    deputes.forEach((depute) => {
        const deputesLi = document.querySelectorAll('.deputes li');
        for (let i = 0, iLength = deputesLi.length; i < iLength; i++) {
            const text = deputesLi[i].innerHTML
                .replace(/&nbsp;|&NBSP;/g, ' ')
                .replace(/^\s|<b>|<\/b>/g, '');
            if (text === depute.firstname + ' ' + depute.lastname) {
                votes[depute.slug] = deputesLi[i].closest('.Pour')
                    ? 'Pour'
                    : deputesLi[i].closest('.Contre')
                    ? 'Contre'
                    : deputesLi[i].closest('.Abstention')
                    ? 'Abstention'
                    : 'Non-votant';
                return;
            }
        }
        votes[depute.slug] = 'Absent';
    });

    return votes;
};
