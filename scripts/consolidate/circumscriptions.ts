import circumscriptionsFirstRound from '../data/circumscription_results_1st_round.json';
import candidates from '../data/candidates.json'
import {writeFile} from "$helpers/writeFile";
import {circonscriptionJSONPath, deputeJSONPath} from "../config";
import path from "path";
import {slugify, slugifyNames} from "$helpers/slugify";
import {mapNosDeputes} from "../helpers/mapNosDeputes";
import {ScrapQueue} from "../helpers/scrapQueue";


const scrapQueue = new ScrapQueue(500);

const mapParty = (parti : string) => {
    switch(parti) {
        case 'RN':
            return ['Rassemblement National', 'RN'];
        case 'LRM':
            return ['La République en Marche', 'LREM', 'Ensemble'];
        case 'LR':
            return ['Les Républicains', 'LR', 'LR'];
        case 'LFI':
            return ['La France Insoumise', 'LFI', 'NUPES'];
        case 'PS':
            return ['Parti Socialiste', 'PS', 'NUPES'];
        case 'Parti animaliste':
            return ['Parti animaliste', 'PA'];
        case 'LO':
            return ['Lutte ouvrière', 'LO'];
        case 'EE-LV':
            return ['Europe, Ecologie, les Verts', 'EELV', 'NUPES'];
        case 'Parti pirate':
            return ['Parti pirate', 'PP']
        case 'Reconquête':
            return ['Reconquête', 'R']
        case 'LRM,Horizons':
            return ['Horizons', 'H', 'Ensemble']
        case 'LR,UDI':
            return ['Union des Démocrates et Indépendants', 'UDI', 'LR']
        case 'PCF':
            return ['Parti Communiste Français', 'PCF', 'NUPES']
        case 'Nouveaux démocrates':
            return ['Nouveaux démocrates', 'ND']
        case 'Partit occitan':
            return ['Parti Occitan', 'PO']
        case 'FGR':
            return ['Fédération de la Gauche Républicaine', 'FGR'];
        case 'Les Centristes,LR':
            return ['Les centristes', 'LC', 'LR']
        case 'PRG':
            return ['Parti Radical de Gauche', 'PRG']
        case 'Génération écologie':
            return ['Génération écologie', 'GE']
        case 'Génération·s':
            return ['Génération·s', 'G', 'NUPES'];
        case 'REV,LFI':
            return ['Révolution Ecologique pour le Vivant', 'REV', 'NUPES']
        default:
            console.log(parti)
                return [parti, parti]
    }

}

const consolidate = async () => {
    const raw = (await scrapQueue.fetch('https://www.nosdeputes.fr/synthese/data/json')).deputes;
    const deputes = mapNosDeputes(raw);
    for (let i = 0, iLength= circumscriptionsFirstRound.length; i<iLength;i++) {
        const c= circumscriptionsFirstRound[i];
        let _countyId: string = c.countyId.toString();
        while(_countyId.length < 3) _countyId = '0'+_countyId;
        let _circumscription: string = c.circumscription.toString();
        if (_circumscription.length === 1) _circumscription = '0'+_circumscription;

        const fullId = _countyId+'-'+_circumscription;
        const number = parseInt(c.circumscription.toString());
        const slug = slugify(`${c.county} ${number}`);

        const circumscription = {
            countyId: c.countyId,
            number,
            name: c.county,
            candidates: candidates.filter(c => c.circonscription === fullId).map(c => {
                const slug = slugifyNames(c.prenom, c.nom);
                const [group, groupShort] =  mapParty(c.parti);
                return deputes.find(d => d.slug === slug) || {
                    firstname: c.prenom,
                    lastname: c.nom,
                    group,
                    groupShort,
                    gender: c.sexe === 'homme' ? 'H' : c.sexe === 'femme' ? 'F' : 'N',
                    noPicture: true
                }
            })
        }


        await writeFile(path.join(circonscriptionJSONPath, slug+'.json'), JSON.stringify(circumscription, null, 4))

    }


};

consolidate();
