import axios from 'axios';
import {slugify, slugifyNames} from '$helpers/slugify';
import { writeFile } from '$helpers/writeFile';
import { deputeJSONPath, deputePicturePath, scrutinJSONPath } from '../config';
import { emptyDir } from '$helpers/emptyDir';
import path from 'path';
import { ScrapQueue } from '../helpers/scrapQueue';
import { ScrutinType } from '$types/scrutinTypes';
const scrutins = require('../data/scrutins2.json');
const scandals = require('../data/scandals.json');
import candidates from '../data/candidates.json';
import circumscriptionsFirstRound from '../data/circumscription_results_1st_round.json';
import {mapNosDeputes} from "../helpers/mapNosDeputes";

export type Scrutin = {
    'N° Scrutin': number;
    'Titre loi': string;
    Catégorie: 'Écologie' | 'Droits humains' | 'Éducation' | 'Pauvreté';
    'Description (optionnelle)': string;
    Impact: 'Positif' | 'Négatif';
};
const scrapQueue = new ScrapQueue(500);
const skip = {
    image: true
};

const consolidate = async () => {
    await emptyDir(deputeJSONPath);
    if (!skip.image) await emptyDir(deputePicturePath);
    const raw = (await scrapQueue.fetch('https://www.nosdeputes.fr/synthese/data/json')).deputes;
    const parsed = mapNosDeputes(raw)
    parsed.forEach(d => {
        const _candidate = candidates.find(({ prenom, nom }: any) => prenom === d.firstname && nom === d.lastname );
        if (!_candidate) d.candidate = false;
        else {
            const _countyId = _candidate.circonscription.replace(/-\d+/, '');
            const circumscription = parseInt(_candidate.circonscription.replace(/\d+-/, ''));
            const county = circumscriptionsFirstRound.find(circ =>
                circ.countyId.toString().replace(/^0+/, '') ===_countyId.replace(/^0+/, '')
            )?.county;
            d.candidate = {
                countyId: _countyId,
                circumscription,
                circumscriptionSlug: slugify(`${county} ${circumscription}`),
                county
            }
        }
    });

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

    scrutins.forEach((s: Scrutin) => {
        if (typeof s['N° Scrutin'] !== 'number') return;
        const scrutin: ScrutinType = require(path.join(scrutinJSONPath, s['N° Scrutin'] + '.json'));
        parsed.forEach((d) => {
            const vote = scrutin.votes.find(
                ({ firstname, lastname }) => d.firstname === firstname && d.lastname === lastname
            );
            if (
                vote &&
                ['La République en Marche', 'LREM', 'LaREM', 'Gouvernement'].includes(
                    scrutin.initiative
                )
            ) {
                if (vote.vote === 'Pour') d.supportedGovernment++;
                if (vote.vote === 'Contre') d.opposedGovernment++;
                if (vote.vote) d.governmentLaws++;
            }
            d.votes.push({
                initiative: scrutin.initiative,
                name: scrutin.title,
                category: scrutin.category,
                impactModifier: scrutin.impactModifier,
                vote: vote?.vote || 'Absent',
                notes: scrutin.notes
            });
        });
    });

    await Promise.all(
        parsed.map(async (d) => {
            const deputeScandals =
                scandals.find((s) => s['Députés'] === `${d.lastname} ${d.firstname}`) || {};

            if (deputeScandals['Accusations sans poursuites']) {
                d.scandals.push({
                    type: 'Accusations sans poursuites',
                    subjects: deputeScandals['Sujet__1'].split(/ [-;] /)
                });
            }

            if (deputeScandals['Enquête']) {
                d.scandals.push({
                    type: 'Enquête',
                    subjects: deputeScandals['Sujet__2'].split(/ [-;] /)
                });
            }

            if (deputeScandals['Mis en examen']) {
                d.scandals.push({
                    type: 'Mise en examen',
                    subjects: deputeScandals['Sujet__3'].split(/ [-;] /)
                });
            }

            if (deputeScandals['Condamné.e']) {
                d.scandals.push({
                    type: 'Condamnation',
                    subjects: deputeScandals['Sujet__4'].split(/ [-;] /)
                });
            }

            d.presenceAverages = presenceAverages;

            const groupMembers = parsed.filter(
                (i) => i.groupShort === d.groupShort && i.slug !== d.slug
            );
            let votedAsGroup = 0;
            let totalGroupVotes = 0;
            d.votes.forEach((v) => {
                if (v.vote !== 'Absent') {
                    totalGroupVotes++;
                    let groupVotes = [];
                    groupMembers.forEach((i) => {
                        const groupMemberVote = i.votes.find(({ name }) => name === v.name).vote;
                        if (groupMemberVote === 'Absent') return;
                        const gvIndex = groupVotes.findIndex((gv) => gv.vote === groupMemberVote);
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
                const img = await scrapQueue
                    .fetch(
                        'https://www2.assemblee-nationale.fr/static/tribun/15/photos/' +
                            d.id +
                            '.jpg',
                        {
                            responseType: 'arraybuffer'
                        }
                    )
                    .then((r) => Buffer.from(r, 'binary'));

                await writeFile(deputePicturePath + d.slug + '.jpg', img);
            }

            return await writeFile(`${deputeJSONPath}${d.slug}.json`, JSON.stringify(d, null, 4));
        })
    );
};

consolidate();
