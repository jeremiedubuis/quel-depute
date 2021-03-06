import styles from './DeputeBlock.module.css';
import React, { MouseEventHandler, useEffect } from 'react';
import Link from 'next/link';
import { slugify, slugifyNames } from '$helpers/slugify';
import { BaseDepute, Candidate, Depute } from '$types/deputeTypes';
import { DeputeBlockCircumscription } from '$components/depute/DeputeBlock/DeputeBlockCircumscription';
import { cn } from '$helpers/cn';
import { colors, groups } from '$components/depute/DeputeBlock/colors';
import {NuanceBlock} from "$components/depute/DeputeBlock/NuanceBlock";

const isCandidate = (d: Candidate | BaseDepute | Depute): d is Candidate => {
    return !!(d as Candidate).candidate;
};

export const DeputeBlock: React.FC<{
    depute: Candidate | BaseDepute | Depute;
    isLink?: boolean;
    isLinkToCircumscription?: boolean;
    TitleTag?: keyof JSX.IntrinsicElements;
    onClick?: MouseEventHandler;
    noCounty?: boolean;
    className?: string;
    noPicture?: boolean;
    showGroup?: boolean;
}> = ({
    depute,
    isLink,
    TitleTag = 'h3',
    onClick,
    noCounty,
    isLinkToCircumscription,
    className,
    noPicture,
    showGroup
}) => {

    const content = (
        <>
            {!noPicture && (
                <div
                    className={styles.picture}
                    style={{
                        backgroundImage: `url(/img/deputes/${slugifyNames(
                            depute.firstname,
                            depute.lastname
                        )}.jpg)`
                    }}
                />
            )}
            <TitleTag className={styles.title}>
                <span>{depute.firstname}</span> <span>{depute.lastname}</span>
            </TitleTag>
            {!noCounty && <DeputeBlockCircumscription depute={depute as BaseDepute} />}
            {isCandidate(depute) && !showGroup ? (
                <NuanceBlock candidate={depute} />
            ) : depute.noPartyImage ? (
                <div className={styles.parti} style={{ background: colors[depute.party] }}>
                    {depute.party}
                </div>
            ) : (
                <>
                    <img
                        className={styles.group}
                        src={`/img/groups/${depute.partyShort}.svg`}
                        alt=""
                    />
                </>
            )}
        </>
    );

    return (
        <>
            {isLink || isLinkToCircumscription ? (
                <Link
                    href={
                        isLinkToCircumscription
                            ? `/circonscriptions/${slugify(
                                  `${depute.county} ${depute.circumscription}`
                              )}`
                            : `/deputes/${slugifyNames(depute.firstname, depute.lastname)}`
                    }
                >
                    <a className={cn(styles.block, className)} onClick={onClick}>
                        {' '}
                        {content}
                    </a>
                </Link>
            ) : (
                <div className={cn(styles.block, className)} onClick={onClick}>
                    {content}
                </div>
            )}
        </>
    );
};
