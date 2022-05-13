import { JSDOM } from 'jsdom';
import { Depute, VoteValue } from '$types/deputeTypes';
import { ScrapQueue } from './helpers/scrapQueue';

export type Scrutin = {
    'N° Scrutin': number;
    'Titre loi': string;
    Catégorie: 'Écologie' | 'Droits humains' | 'Éducation' | 'Pauvreté';
    'Description (optionnelle)': string;
    Impact: 'Positif' | 'Négatif';
};

const scrapQueue = new ScrapQueue();

const getAuthors = async (n: number) => {
    const last = 4419;
    const page = Math.floor((last - n) / 100);
    let html = await scrapQueue.fetch(
        `https://www2.assemblee-nationale.fr/scrutins/liste/(offset)/${
            page * 100
        }/(legislature)/15/(type)/TOUS/(idDossier)/TOUS`,
    );
    let dom = new JSDOM(html);
    let document = dom.window.document;
    const td = Array.from(document.querySelectorAll('.denom')).find(
        (td) => td.textContent.replace(/\*$/, '') === n.toString(),
    );
    const slug = (td.parentNode.querySelector('.desc a:first-of-type') as HTMLLinkElement).href
        .split('/')
        .pop()
        .replace(/\.asp$/, '');
    try {
        html = await scrapQueue.fetch(
            `https://www.assemblee-nationale.fr/dyn/15/dossiers/alt/${slug}`,
        );
        dom = new JSDOM(html);
        document = dom.window.document;
    } catch (e) {
        console.log(slug, `https://www.assemblee-nationale.fr/dyn/15/dossiers/alt/${slug}`);
        return [];
    }
    return Array.from(document.querySelectorAll('.nom-personne a')).map((a) => {
        const names = a.textContent.replace(/M\. |Mme /, '').split(' ');
        return { firstname: names[0], lastname: names.slice(1).join(' ') };
    });
};

export const scrapScrutin = async (
    scrutin: Scrutin,
    deputes: Depute[],
): Promise<{ authors: Depute[]; votes: { [fullname: string]: VoteValue }; initiative: string }> => {
    if (!scrutin['N° Scrutin']) console.log(scrutin);
    const html = await scrapQueue.fetch(
        `https://www2.assemblee-nationale.fr/scrutins/detail/(legislature)/15/(num)/${scrutin['N° Scrutin']}`,
    );

    const _authors = await getAuthors(scrutin['N° Scrutin']);
    const authors = _authors.map((a) =>
        deputes.find(
            ({ firstname, lastname }) => firstname === a.firstname && lastname === a.lastname,
        ),
    );
    const initiative = authors.find((a) => a.group)?.group || 'Gouvernement';
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

    return { authors, initiative, votes };
};
