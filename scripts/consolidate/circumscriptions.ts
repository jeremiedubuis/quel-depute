import circumscriptionsFirstRound from '../data/circumscription_results_1st_round.json';
import circumscriptionsSecondRound from '../data/circumscription_results_2nd_round.json';
import circumscriptionsFirstRound2022 from '../data/2022_circumscription_results_1st_round.json';
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
    let compiled: any = {};

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

        const resultsFirstRound = circumscriptionsFirstRound2022.find((r) => {
            return (
                r.countyId.toString().replace(/^0+/, '') ===
                    (_countyId === '999' ? '99' : _countyId) &&
                r.circumscription === _circumscription
            );
        });

        if (!resultsFirstRound) console.log(_countyId, _circumscription);
        const firstRound = {
            registered: resultsFirstRound.Inscrits,
            voted: resultsFirstRound.Votants,
            whites: resultsFirstRound.Blancs,
            void: resultsFirstRound.Nuls,
            expressed: resultsFirstRound.Exprimes
        };

        const circumscription = {
            countyId: _countyId,
            number,
            name: c.county,
            results: {
                '2017': {
                    firstRound: mapCircumscriptionResults(c),
                    secondRound: mapCircumscriptionResults(circumscriptionsSecondRound[i])
                },
                '2022': {
                    firstRound
                }
            },
            current: deputes.find(
                (d) =>
                    d.countyId.toString().replace(/^0+/, '') === _countyId &&
                    parseInt(d.circumscription) === number
            ),
            candidates: _candidates.map(({ p, ...c }) => {
                const _results = resultsFirstRound.votes.find(
                    (r) =>
                        slugifyNames(r.firstname, r.lastname) ===
                        slugifyNames(c.firstname, c.lastname)
                );

                return {
                    ...c,
                    ...partyToPartyShortAndImage(c.party),
                    candidate: true,
                    firstRound: _results?.NbVoix
                };
            })
        };

        let qualified = circumscription.candidates.filter((c) => {
            return (c.firstRound / firstRound.registered) * 100 > 12.5;
        });
        const electedFirstRound = qualified.find(
            (c) =>
                (c.firstRound / firstRound.expressed) * 100 > 50 &&
                (c.firstRound / firstRound.registered) * 100 >= 25
        );
        if (electedFirstRound) {
            qualified = [electedFirstRound];
        } else if (qualified.length === 1) {
            qualified.push(
                circumscription.candidates
                    .filter(
                        (c) =>
                            c.lastname !== qualified[0].lastname &&
                            c.firstname !== qualified[0].firstname
                    )
                    .reduce((acc, c) => {
                        if (!acc || c.firstRound > acc.firstRound) return c;
                        return acc;
                    }, null)
            );
        }

        circumscription.candidates.forEach((c) => {
            if (qualified.find((q) => c.firstname === q.firstname && q.lastname === c.lastname))
                c.qualified = true;
        });

        const winner = circumscription.candidates.reduce((acc, c) => {
            if (!acc || c.firstRound > acc.firstRound) return c;
            return acc;
        }, null);
        if (!compiled[winner.nuanceComputed]) compiled[winner.nuanceComputed] = 1;
        else compiled[winner.nuanceComputed]++;

        await writeFile(
            path.join(circonscriptionJSONPath, slug + '.json'),
            JSON.stringify(circumscription, null, 4)
        );
    }

    extrapolate(compiled);
};

const extrapolate = (compiled: any) => {
    compiled = Object.keys(compiled).reduce(
        (acc, k) => {
            if (k.endsWith('Nupes') || /PCF|PS|LFI/.test(k)) acc.NUPES += compiled[k];
            else if (k.endsWith('Ensemble')) acc.Ensemble += compiled[k];
            else {
                acc[k] = compiled[k];
            }
            return acc;
        },
        { NUPES: 0, Ensemble: 0 }
    );

    console.log(
        Object.keys(compiled).reduce((acc, k) => acc + compiled[k], 0),
        compiled,
        Object.keys(compiled).reduce((acc, k) => {
            acc[k] = (compiled[k] / 577) * 100;
            return acc;
        }, {})
    );
};

consolidate();
