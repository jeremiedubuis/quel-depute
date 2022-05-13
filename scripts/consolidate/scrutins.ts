import { emptyDir } from '$helpers/emptyDir';
import { scrutinJSONPath } from '../config';
import { ScrapQueue } from '../helpers/scrapQueue';
import { JSDOM } from 'jsdom';
import { writeFile } from '$helpers/writeFile';
import path from 'path';
import { testNameAndVariation } from '../helpers/variableNames';
const scrutins = require('../data/scrutins2.json');

export type Scrutin = {
    'N° Scrutin': number;
    'Titre loi': string;
    Catégorie: 'Écologie' | 'Droits humains' | 'Éducation' | 'Pauvreté';
    'Description (optionnelle)': string;
    Impact: 'Positif' | 'Négatif';
};

const scrapQueue = new ScrapQueue(500);

const parseDosierLegislatif = async (n: number) => {
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
        return { slug, authors: [] };
    }
    return {
        slug,
        href: `https://www.assemblee-nationale.fr/dyn/15/dossiers/alt/${slug}`,
        authors: Array.from(document.querySelectorAll('.nom-personne a')).map((a) => {
            const names = a.textContent.replace(/M\. |Mme /, '').split(' ');
            return { firstname: names[0], lastname: names.slice(1).join(' ') };
        }),
    };
};

const consolidate = async () => {
    await emptyDir(scrutinJSONPath);

    const listOutput = [];
    const deputes = require('../../public/json/deputes.json');
    for (let i = 0, iLength = scrutins.length; i < iLength; i++) {
        const s: Scrutin = scrutins[i];
        const { authors, href, slug } = await parseDosierLegislatif(s['N° Scrutin']);
        const _authors = authors.map((a) =>
            deputes.find((d) => d.lastname === a.lastname && d.firstname === a.firstname),
        );

        const base = {
            number: s['N° Scrutin'],
            title: s['Titre loi'],
            category: s['Catégorie'],
            href,
            slug,
            initiative: _authors.find((a) => a.groupShort)?.groupShort || 'Gouvernement',
        };

        listOutput.push(base);

        const output = { ...base, votes: [], authors };

        const html = await scrapQueue.fetch(
            `https://www2.assemblee-nationale.fr/scrutins/detail/(legislature)/15/(num)/${s['N° Scrutin']}`,
        );
        const dom = new JSDOM(html);
        const document = dom.window.document;
        const deputesLi = document.querySelectorAll('.deputes li');
        Array.from(deputesLi).forEach((li) => {
            const text = li.innerHTML
                .replace(/&nbsp;|&NBSP;/g, ' ')
                .replace(/^\s|<b>|<\/b>/g, '')
                .replace(' (par délégation)', '');

            let depute = deputes.find((d) =>
                testNameAndVariation(text, d.firstname + ' ' + d.lastname),
            );
            if (!depute) {
                const [firstname, lastname] = text.split(/\s/);
                const group = li
                    .closest('.TTgroupe')
                    .querySelector('.nomgroupe')
                    .textContent?.replace(/Groupe (?:du )?/, '')
                    ?.replace(/ \(.*/, '');
                const groupShort = deputes.find((d) => d.group === group)?.groupShort;
                depute = {
                    firstname,
                    lastname,
                    group,
                    groupShort,
                };
                console.log(text, 'is missing');
            }
            output.votes.push({
                firstname: depute.firstname,
                lastname: depute.lastname,
                delegation: text.includes('(par délégation)'),
                group: depute.group,
                groupShort: depute.groupShort,
                vote: li.closest('.Pour')
                    ? 'Pour'
                    : li.closest('.Contre')
                    ? 'Contre'
                    : li.closest('.Abstention')
                    ? 'Abstention'
                    : 'Non-votant',
            });
        });

        await writeFile(
            path.join(scrutinJSONPath, output.number + '.json'),
            JSON.stringify(output, null, 4),
        );
    }

    await writeFile(path.join(scrutinJSONPath, 'votes.json'), JSON.stringify(listOutput, null, 4));
};

consolidate();