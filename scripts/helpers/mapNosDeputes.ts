import {slugifyNames} from "$helpers/slugify";

export const mapNosDeputes = (data: any) => {
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
            slug: slugifyNames(prenom, nom_de_famille),
            gender: sexe,
            birthday: date_naissance,
            birthplace: lieu_naissance,
            county: nom_circo,
            countyId: num_deptmt,
            circumscription: num_circo,
            mandateStart: mandat_debut,
            group: parti_ratt_financier,
            groupShort: groupe_sigle,
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