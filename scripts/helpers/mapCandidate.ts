import circumscriptionsFirstRound from '../data/circumscription_results_1st_round.json';

const mapParty = (parti: string) => {
    switch (parti) {
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
            return ['Europe Écologie Les Verts', 'EELV', 'NUPES'];
        case 'Parti pirate':
            return ['Parti pirate', 'PP'];
        case 'Reconquête':
            return ['Reconquête', 'RC'];
        case 'LRM,Horizons':
            return ['Horizons', 'H', 'Ensemble'];
        case 'LR,UDI':
            return ['Union des Démocrates et Indépendants', 'UDI'];
        case 'PCF':
            return ['Parti Communiste Français', 'PCF', 'NUPES'];
        case 'Nouveaux démocrates':
            return ['Nouveaux démocrates', 'ND'];
        case 'Partit occitan':
            return ['Parti Occitan', 'PO'];
        case 'FGR':
            return ['Fédération de la Gauche Républicaine', 'FGR'];
        case 'Les Centristes,LR':
            return ['Les centristes', 'LC'];
        case 'PRG':
            return ['Parti Radical de Gauche', 'PRG'];
        case 'Génération écologie':
            return ['Génération écologie', 'GE'];
        case 'Génération·s':
            return ['Génération·s', 'G', 'NUPES'];
        case 'REV,LFI':
            return ['Révolution Ecologique pour le Vivant', 'REV', 'NUPES'];
        default:
            console.log(parti);
            return [parti, parti];
    }
};

export const mapCandidate = (c: any) => {
    const [group, groupShort] = mapParty(c.parti);
    const countyId = parseInt(c.circonscription.replace(/-\d+/, ''));
    const circumscription = parseInt(c.circonscription.replace(/\d+-/, ''));

    const county = circumscriptionsFirstRound.find((circ) => {
        return parseInt(circ.countyId.toString()) === countyId;
    })?.county;

    return {
        firstname: c.prenom,
        lastname: c.nom,
        gender: c.sexe === 'homme' ? 'H' : c.sexe === 'femme' ? 'F' : 'N',
        noPicture: true,
        candidate: true,
        group,
        groupShort,
        countyId,
        county,
        circumscription
    };
};
