import { slugifyNames } from '$helpers/slugify';

export const partyToPartyShortAndImage = (party: string) => {
    switch (party) {
        case 'Les Républicains':
            return { partyShort: 'LR' };
        case 'La République en Marche':
        case 'La République en marche':
        case 'En marche !':
            return { partyShort: 'LREM' };
        case 'Régions et peuples solidaires':
            return { partyShort: 'RPS', noPartyImage: true };
        case 'Rassemblement national':
            return { partyShort: 'RN' };
        case 'Union des démocrates, radicaux et libéraux':
            return { partyShort: 'UDRL', noPartyImage: true };
        case 'La France Insoumise':
        case 'La France insoumise':
            return { partyShort: 'LFI' };
        case 'Luttre ouvrière':
            return { partyShort: 'LO' };
        case 'Parti Socialiste':
        case 'Parti socialiste':
            return { partyShort: 'PS' };
        case 'Parti communiste Français':
            return { partyShort: 'PCF' };
        case 'Europe Écologie Les Verts':
        case 'Europe Ecologie-Les Verts':
            return { partyShort: 'EELV' };
        case 'Parti Pirate':
            return { partyShort: 'pp' };
        case 'Mouvement Démocrate':
        case 'Mouvement démocrate':
            return { partyShort: 'MODEM' };
        case 'Non rattaché':
            return { partyShort: 'NR', noPartyImage: true };
        case "Tavini Huira'atira":
        case "Tavini Huiraatira No Te Ao Ma'ohi - Front de libération de Polynésie":
            return { partyShort: 'FLP', noPartyImage: true };
        case 'Parti communiste français':
            return { partyShort: 'PCF' };
        case 'Non rattachée':
            return { partyShort: 'NR' };
        case "Cap sur l'avenir":
            return { partyShort: 'CA', noPartyImage: true };
        case 'Parti radical de gauche':
            return { partyShort: 'PRG', noPartyImage: true };
        case 'Calédonie Ensemble':
            return { partyShort: 'CE', noPartyImage: true };
        case 'Debout la France':
            return { partyShort: 'DLF', noPartyImage: true };
        case 'Non déclaré(s)':
            return { partyShort: 'ND', noPartyImage: true };
        case 'Parti progressiste martiniquais':
            return { partyShort: 'PPM', noPartyImage: true };
        case 'Tapura Huiraatira':
        case 'Tapura huiraatira':
            return { partyShort: 'TH', noPartyImage: true };
        case 'Parti animaliste':
            return { partyShort: 'PA' };
        case 'Reconquête !':
            return { partyShort: 'REC' };
        case 'Union des démocrates et indépendants':
            return { partyShort: 'UDI' };
        default:
            console.log(party);
            return { partyShort: party, noPartyImage: true };
    }
};

export const mapNosDeputes = (data: any, groups: any) => {
    return data.map(
        ({
            depute: {
                id_an,
                nom_de_famille,
                prenom,
                sexe,
                date_naissance,
                lieu_naissance,
                num_deptmt,
                nom_circo,
                num_circo,
                mandat_debut,
                mandat_fin,
                groupe_sigle,
                parti_ratt_financier,
                profession,
                semaines_presence,
                commission_presences,
                commission_interventions,
                hemicycle_interventions,
                hemicycle_interventions_courtes,
                amendements_proposes,
                amendements_signes,
                amendements_adoptes,
                rapports,
                propositions_ecrites,
                propositions_signees,
                questions_ecrites,
                questions_orales
            }
        }) => ({
            id: id_an,
            lastname: nom_de_famille,
            firstname: prenom,
            current: !mandat_fin,
            slug: slugifyNames(prenom, nom_de_famille),
            gender: sexe,
            birthday: date_naissance,
            birthplace: lieu_naissance,
            county: nom_circo,
            countyId: parseInt(num_deptmt),
            circumscription: parseInt(num_circo),
            mandateStart: mandat_debut,
            group: groups.find((g) => g.acronyme === groupe_sigle)?.nom,
            groupShort: groupe_sigle,
            party: parti_ratt_financier,
            ...partyToPartyShortAndImage(parti_ratt_financier),
            job: profession,
            votes: [],
            scandals: [],
            presence: {
                weeksActive: semaines_presence,
                reports: rapports,
                proposals: propositions_ecrites,
                proposalsSupported: propositions_signees,
                amendments: amendements_proposes,
                amendmentsSupported: amendements_signes,
                amendmentsAdopted: amendements_adoptes,
                commissionsAttended: commission_presences,
                commissionInterventions: commission_interventions,
                hemicycleInterventions: hemicycle_interventions,
                hemicycleShortInterventions: hemicycle_interventions_courtes,
                questionsWritten: questions_ecrites,
                questionsOral: questions_orales
            },
            opposedGovernment: 0,
            supportedGovernment: 0,
            governmentLaws: 0
        })
    );
};
