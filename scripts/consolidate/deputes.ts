import axios from 'axios';
import {slugifyNames} from '$helpers/slugify';
import { writeFile } from '$helpers/writeFile';
import {deputeJSONPath, deputePicturePath} from '../config';
import { scrapVotes, Scrutin } from '../scrapVotes';
import {emptyDir} from "$helpers/emptyDir";
const scrutins = require('../data/scrutins.json');

const skip = {
    image: false
}

const consolidate = async () => {
    await emptyDir(deputeJSONPath);
    if (!skip.image) await emptyDir(deputePicturePath);
    const raw = await axios
        .get('https://www.nosdeputes.fr/synthese/data/json')
        .then((r) => r.data.deputes);

    const parsed = raw.map(
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
            slug: slugifyNames(prenom,nom_de_famille),
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

    const presenceTotals = parsed.reduce((acc, curr) => {
        Object.keys(curr.presence).forEach((key) => {
            if (!acc[key]) acc[key] = 0;
            acc[key] += curr.presence[key] || 0;
        });

        return acc;
    }, {});
    const presenceAverages = Object.keys(presenceTotals).reduce((acc, curr) => {
        if (!acc[curr]) acc[curr] = Math.round(presenceTotals[curr] / parsed.length);
        return acc;
    }, {});

    await Promise.all(
        scrutins.map(async (s: Scrutin) => {
            const votes = await scrapVotes(s, parsed);
            parsed.forEach((d) => {
                if (s.Initiative === 'LREM' || s.Initiative === 'Gouvernement') {
                    if (votes[d.slug] === 'Pour') d.supportedGovernment++;
                    if (votes[d.slug] === 'Contre') d.opposedGovernment++;
                    if (votes[d.slug] !== 'Absent') d.governmentLaws++;
                }
                d.votes.push({
                    name: s['Nom de la loi'],
                    category: s['Catégorie (écologie, économie...)'],
                    vote: votes[d.slug]
                });
            });
        })
    );

    await Promise.all(
        parsed.map(async (d) => {
            d.presenceAverages = presenceAverages;

            const groupMembers = parsed.filter(
                (i) => i.groupShort === d.groupShort && i.slug !== d.slug
            );
            let votedAsGroup = 0;
            let totalGroupVotes = 0;
            d.votes.forEach((v) => {
                const log = d.slug === 'jeanluc-melenchon' && v.name === 'Projet de loi bioéthique';
                if (v.vote !== 'Absent') {
                    totalGroupVotes++;
                    let groupVotes = [];
                    groupMembers.forEach((i) => {
                        const groupMemberVote = i.votes.find(({ name }) => name === v.name).vote;
                        if (log) console.log('groupMember', i.slug, groupMemberVote);
                        if (groupMemberVote === 'Absent') return;
                        const gvIndex = groupVotes.findIndex((gv) => gv.vote === groupMemberVote);
                        if (log) console.log(gvIndex, { vote: groupMemberVote, count: 1 });
                        if (gvIndex < 0) groupVotes.push({ vote: groupMemberVote, count: 1 });
                        else groupVotes[gvIndex].count++;
                    });

                    const majorityVote = groupVotes.reduce((acc, curr) => {
                        if (acc === null) acc = curr;
                        else if (acc.count < curr.count) acc = curr;
                        return acc;
                    }, null);
                    if (!majorityVote || !groupVotes.length || v.vote === majorityVote.vote)
                        votedAsGroup++;
                }
            });

            d.votedAsGroup = (votedAsGroup / totalGroupVotes) * 100;

            if (!skip.image) {
                const img = await axios
                    .get(
                        'https://www2.assemblee-nationale.fr/static/tribun/15/photos/' +
                        d.id +
                        '.jpg',
                        {
                            responseType: 'arraybuffer'
                        }
                    )
                    .then((r) => Buffer.from(r.data, 'binary'));

                await writeFile(deputePicturePath + d.slug + '.jpg', img);
            }

            return await writeFile(`${deputeJSONPath}${d.slug}.json`, JSON.stringify(d, null, 4));
        })
    );

};

consolidate();
