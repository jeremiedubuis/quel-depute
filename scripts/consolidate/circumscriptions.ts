import circumscriptionsFirstRound from '../data/circumscription_results_1st_round.json';
import circumscriptionsSecondRound from '../data/circumscription_results_2nd_round.json';
import candidates from '../data/candidates.json';
import { writeFile } from '$helpers/writeFile';
import { circonscriptionJSONPath, deputeJSONPath } from '../config';
import path from 'path';
import { slugify, slugifyNames } from '$helpers/slugify';
import { mapNosDeputes } from '../helpers/mapNosDeputes';
import { ScrapQueue } from '../helpers/scrapQueue';
import { mapCandidate } from '../helpers/mapCandidate';
import {emptyDir} from "$helpers/emptyDir";

const scrapQueue = new ScrapQueue(500);

const mapCircumscriptionResults = (c) => ({
    registered: c.Inscrits,
    voted: c.Votants,
    whites: c.Blancs,
    expressed: c.Exprimes,
    void: c.Nuls,
    candidates: {
        'Nathalie Arthaud': c.ARTHAUD,
        'Fabien Roussel': c.ROUSSEL,
        'Emmanuel Macron': c.MACRON,
        'Jean Lasalle': c.LASSALLE,
        'Marine Le Pen': c['LE PEN'],
        'Jean-Luc Mélenchon': c['MÉLENCHON'],
        'Anne Hidalgo': c.HIDALGO,
        'Yannick Jadot': c.JADOT,
        'Valérie Pécresse': c['PÉCRESSE'],
        'Phillipe Poutou': c.POUTOU,
        'Nicolas Dupont-Aignan': c['DUPONT-AIGNAN'],
        'Eric Zemmour': c['ZEMMOUR']
    }
});

const consolidate = async () => {
    const raw = (await scrapQueue.fetch('https://www.nosdeputes.fr/synthese/data/json')).deputes;
    const deputes = mapNosDeputes(raw);
    const mappedCandidates = candidates.map(mapCandidate);
    await emptyDir(circonscriptionJSONPath);

    for (let i = 0, iLength = circumscriptionsFirstRound.length; i < iLength; i++) {
        const c = circumscriptionsFirstRound[i];
        let _countyId: number = parseInt(c.countyId.toString());
        let _circumscription: number = parseInt(c.circumscription.toString());

        const number = parseInt(c.circumscription.toString());
        const slug = slugify(`${c.county} ${number}`);

        const circumscription = {
            countyId: c.countyId,
            number,
            name: c.county,
            results: {
                firstRound: mapCircumscriptionResults(c),
                secondRound: mapCircumscriptionResults(circumscriptionsSecondRound[i])
            },
            current: deputes.find(
                (d) =>
                    parseInt(d.countyId) === parseInt(c.countyId.toString()) &&
                    parseInt(d.circumscription) === number
            ),
            candidates: mappedCandidates.filter(
                (c) => c.countyId === _countyId && c.circumscription === _circumscription
            )
        };

        await writeFile(
            path.join(circonscriptionJSONPath, slug + '.json'),
            JSON.stringify(circumscription, null, 4)
        );
    }
};

consolidate();
