//@ts-nocheck
import axios from 'axios';
import { JSDOM } from 'jsdom';
import scrutins from './data/scrutins.json';
import villages from './data/villages.json';
import circumscriptionResults1stRound from './data/circumscription_results_1st_round.json';
import deputes from '../public/json/deputes.json';
import { slugify, slugifyNames } from '$helpers/slugify';
import type { BaseDepute, Depute } from '$types/deputeTypes';
import { deputeJSONPath, deputePicturePath, villageJSONPath } from './config';
import { writeFile } from '$helpers/writeFile';

const skipSteps = {
    deputes: {
        json: false,
        picture: true
    },
    villages: true
};

const scrap = async (legislature: number, [scrutin, weight]: number[]) => {
    const html = await axios
        .get(
            `https://www2.assemblee-nationale.fr/scrutins/detail/(legislature)/${legislature}/(num)/${scrutin}`
        )
        .then((r) => r.data);

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const title = document.querySelector('.president-title').innerHTML;
    console.log(title);

    let scrapped: { title: string; weight: number; votes: { [name: string]: string } } = {
        title,
        weight,
        votes: {}
    };
    deputes.forEach((depute) => {
        const deputes = document.querySelectorAll('.deputes li');
        scrapped.votes[depute.id] = 'Absent';
        for (let i = 0, iLength = deputes.length; i < iLength; i++) {
            const text = deputes[i].innerHTML
                .replace(/&nbsp;|&NBSP;/g, ' ')
                .replace(/^\s|<b>|<\/b>/g, '');
            if (text === depute.firstname + ' ' + depute.lastname) {
                scrapped.votes[depute.id] = deputes[i].closest('.Pour')
                    ? 'Pour'
                    : deputes[i].closest('.Contre')
                    ? 'Contre'
                    : deputes[i].closest('.Abstention')
                    ? 'Abstention'
                    : 'Non-votant';
            }
        }
    });

    return scrapped;
};

const computeFirstRoundResults = (depute: BaseDepute) => {
    const results = circumscriptionResults1stRound.find(
        (c) => c.county === depute.county && c.circumscription === depute.circumscription
    );
    if (!results) {
        console.log('missing', depute.county, depute.circumscription);
        return undefined;
    }
    return {
        registered: results.Inscrits,
        voted: results.Votants,
        whites: results.Blancs,
        void: results.Nuls,
        candidates: {
            'Nathalie Arthaud': results.ARTHAUD,
            'Fabien Roussel': results.ROUSSEL,
            'Emmanuel Macron': results.MACRON,
            'Jean Lasalle': results.LASSALLE,
            'Marine Le Pen': results['LE PEN'],
            'Jean-Luc Mélenchon': results['MÉLENCHON'],
            'Anne Hidalgo': results.HIDALGO,
            'Yannick Jadot': results.JADOT,
            'Valérie Pécresse': results['PÉCRESSE'],
            'Phillipe Poutou': results.POUTOU,
            'Nicolas Dupont-Aignan': results['DUPONT-AIGNAN']
        }
    };
};

export const scrapAll = async () => {
    if (!skipSteps.deputes.json) {
        const scrappedScrutins = [];

        for (let i = 0, iLength = scrutins.length; i < iLength; i++) {
            scrappedScrutins.push(await scrap(15, scrutins[i]));
        }

        for (let i = 0, iLength = deputes.length; i < iLength; i++) {
            const slug = slugifyNames(deputes[i].firstname, deputes[i].lastname);
            const depute: Depute = {
                ...deputes[i],
                countyId: (circumscriptionResults1stRound.find(
                    (c) => c.county === deputes[i].county
                )?.countyId || 99) as number,
                slug
            };
            depute.firstRoundResults = computeFirstRoundResults(depute);

            if (!skipSteps.deputes.picture) {
                const img = await axios
                    .get(
                        'https://www2.assemblee-nationale.fr/static/tribun/15/photos/' +
                            deputes[i].id +
                            '.jpg',
                        {
                            responseType: 'arraybuffer'
                        }
                    )
                    .then((r) => Buffer.from(r.data, 'binary'));

                await writeFile(deputePicturePath + depute.slug + '.jpg', img);
            }

            for (let j = 0, jLength = scrappedScrutins.length; j < jLength; j++) {
                depute.votes[scrappedScrutins[j].title] = {
                    weight: scrappedScrutins[j].weight,
                    vote: scrappedScrutins[j].votes[deputes[i].id]
                };
            }

            await writeFile(
                deputeJSONPath + depute.slug + '.json',
                JSON.stringify(depute, null, 4)
            );
        }
    }

    if (!skipSteps.villages) {
        const counties = villages.reduce((acc, curr) => {
            if (!acc[curr.countyName]) acc[curr.countyName] = [];
            acc[curr.countyName].push(curr);
            return acc;
        }, {});

        await Promise.all(
            Object.keys(counties).map((c) =>
                writeFile(
                    villageJSONPath + slugify(c) + '.json',
                    JSON.stringify(counties[c], null, 4)
                )
            )
        );
    }

    process.exit(0);
};

scrapAll();
