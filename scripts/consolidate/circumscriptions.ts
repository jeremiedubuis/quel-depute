import circumscriptionsFirstRound from '../data/circumscription_results_1st_round.json';
import circumscriptionsSecondRound from '../data/circumscription_results_2nd_round.json';
import candidates from '../data/candidates.json';
import { writeFile } from '$helpers/writeFile';
import { circonscriptionJSONPath, deputeJSONPath } from '../config';
import path from 'path';
import { slugify, slugifyNames } from '$helpers/slugify';
import { mapNosDeputes, partyToPartyShortAndImage } from '../helpers/mapNosDeputes';
import { ScrapQueue } from '../helpers/scrapQueue';
import { emptyDir } from '$helpers/emptyDir';
import { pad } from '../helpers/pad';

const scrapQueue = new ScrapQueue(500);

const groupToGroupShort = (group: string) => {
    group = group.replace(/\s/g, ' ').toLowerCase();
    switch (group) {
        case 'la france insoumise':
            return 'LFI';
        case 'parti socialiste':
            return 'PS';
        case 'parti communiste français':
            return 'PCF';
        case 'les républicains':
            return 'LR';
        case 'reconquête !':
            return 'REC';
        case 'la république en marche':
            return 'LREM';
        case 'rassemblement national':
            return 'RN';
        case 'lutte ouvrière':
        case 'Lutte ouvrière':
        case 'Lutte Ouvrière':
            return 'LO';
        case 'nouveau Parti anticapitaliste':
            return 'NPA';
        case 'mouvement démocrate':
            return 'MoDem';
        case 'les centristes':
            return 'LC';
        case 'debout la france':
            return 'DF';
        case 'parti animaliste':
            return 'PA';
        case 'parti radical de gauche':
            return 'PRG';
        case 'génération.s':
            return 'GS';
        case 'europe ecologie-les verts':
            return 'EELV';
        case 'les patriotes':
            return 'LP';
        case 'union des démocrates et indépendants':
            return 'UDI';
        case 'parti pirate':
            return 'PP';
        default:
            console.log(group);
            return group;
    }
};

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
    const groups = (
        await scrapQueue.fetch('https://www.nosdeputes.fr/organismes/groupe/json')
    ).organismes.filter(({ type }) => type === 'groupe');
    const deputes = mapNosDeputes(raw, groups);
    await emptyDir(circonscriptionJSONPath);

    for (let i = 0, iLength = circumscriptionsFirstRound.length; i < iLength; i++) {
        const c = circumscriptionsFirstRound[i];
        let _countyId: string = c.countyId.toString().replace(/^0+/, '');
        let _circumscription: number = parseInt(c.circumscription.toString());
        const paddedCounty = pad(_countyId === '999' ? '99' : _countyId, 3);
        const paddedCircumscription = pad(_circumscription, 2);
        let _candidates = candidates[paddedCounty + '_' + paddedCircumscription];
        if (!_candidates) {
            console.log(paddedCounty + '_' + paddedCircumscription);
            _candidates = [];
        }

        const number = parseInt(c.circumscription.toString());
        const slug = slugify(`${c.county} ${number}`);

        const circumscription = {
            countyId: _countyId,
            number,
            name: c.county,
            results: {
                firstRound: mapCircumscriptionResults(c),
                secondRound: mapCircumscriptionResults(circumscriptionsSecondRound[i])
            },
            current: deputes.find(
                (d) =>
                    d.countyId.toString().replace(/^0+/, '') === _countyId &&
                    parseInt(d.circumscription) === number
            ),
            candidates: _candidates.map(({ p, ...c }) => ({
                ...c,
                ...partyToPartyShortAndImage(c.party),
                candidate: true
            }))
        };

        await writeFile(
            path.join(circonscriptionJSONPath, slug + '.json'),
            JSON.stringify(circumscription, null, 4)
        );
    }
};

consolidate();
