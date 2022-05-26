import styles from './DeputeBlock.module.css';
import React from 'react';
import { Depute } from '$types/deputeTypes';
import { Title } from '$components/text/Title/Title';
import { Tooltip } from '$components/text/Tooltip/Tooltip';
import type { Scandal } from '$types/deputeTypes';
import { AiFillInfoCircle } from 'react-icons/ai';
import Link from 'next/link';
import { slugify } from '$helpers/slugify';

const Scandal: React.FC<{ scandal: Scandal; children: string }> = ({ scandal, children }) => (
    <Tooltip
        content={
            <ul>
                {scandal.subjects.map((s) => (
                    <li key={s}>{s}</li>
                ))}
            </ul>
        }
        className={styles.scandal}
    >
        <AiFillInfoCircle />
        {children}
    </Tooltip>
);

export const DeputeBlockDetails: React.FC<{ depute: Depute }> = ({ depute }) => {
    const accusations = depute.scandals.find(({ type }) => type === 'Accusations sans poursuites');
    const investigations = depute.scandals.find(({ type }) => type === 'Enquête');
    const prosecutions = depute.scandals.find(({ type }) => type === 'Mise en examen');
    const convictions = depute.scandals.find(({ type }) => type === 'Condamnation');
    return (
        <div className={styles.details}>
            {depute.candidate ? (
                <Link
                    href={`/circonscriptions/${slugify(
                        `${depute.candidate.county} ${depute.candidate.circumscription}`
                    )}`}
                >
                    <a>
                        Est candidat: {depute.candidate.county} ({depute.candidate.circumscription})
                    </a>
                </Link>
            ) : (
                'Ne se représente pas'
            )}
            {depute.scandals.length > 0 && (
                <>
                    <Title size="small" TitleTag="h4">
                        Polémiques
                    </Title>
                    <ul>
                        {accusations && (
                            <li>
                                <Scandal scandal={accusations}>Accusations</Scandal>
                            </li>
                        )}
                        {investigations && (
                            <li>
                                <Scandal scandal={investigations}>Enquêtes</Scandal>
                            </li>
                        )}
                        {prosecutions && (
                            <li>
                                <Scandal scandal={prosecutions}>Mises en examen</Scandal>
                            </li>
                        )}
                        {convictions && (
                            <li>
                                <Scandal scandal={convictions}>Condamnations</Scandal>
                            </li>
                        )}
                    </ul>
                </>
            )}
            <Title size="small" TitleTag="h4">
                Activité parlementaire
            </Title>
            <ul>
                <li>{(depute as Depute).presence.amendments} amendements proposés</li>
                <li>{(depute as Depute).presence.amendmentsSupported} amendements soutenus</li>
                <li>
                    {(depute as Depute).presence.commissionInterventions} interventions en
                    commission
                </li>
            </ul>
        </div>
    );
};
