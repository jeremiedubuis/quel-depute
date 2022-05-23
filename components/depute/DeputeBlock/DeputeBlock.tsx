import styles from './DeputeBlock.module.css';
import React, { MouseEventHandler } from 'react';
import Link from 'next/link';
import { slugifyNames } from '$helpers/slugify';
import {BaseDepute, Candidate, Depute} from '$types/deputeTypes';
import { DeputeBlockDetails } from '$components/depute/DeputeBlock/DeputeBlockDetails';
import {DeputeBlockCircumscription} from "$components/depute/DeputeBlock/DeputeBlockCircumscription";

export const DeputeBlock: React.FC<{
    depute: Candidate  | BaseDepute | Depute;
    isLink?: boolean;
    TitleTag?: keyof JSX.IntrinsicElements;
    onClick?: MouseEventHandler;
    detailed?: boolean;
    noCounty?: boolean;
}> = ({ depute, isLink, TitleTag = 'h3', onClick, detailed, noCounty }) => {
    const content = (
        <>

            { !depute.noPicture && <div
                className={styles.picture}
                style={{
                    backgroundImage: `url(/img/deputes/${slugifyNames(
                        depute.firstname,
                        depute.lastname
                    )}.jpg)`
                }}
            /> }
            <TitleTag className={styles.title}>
                <span>{depute.firstname}</span> <span>{depute.lastname}</span>
            </TitleTag>
            { !noCounty && <DeputeBlockCircumscription depute={depute as BaseDepute} /> }
            <img className={styles.group} src={`/img/groups/${depute.groupShort}.svg`} alt="" />
        </>
    );

    return (
        <>
            {isLink ? (
                <Link href={`/deputes/${slugifyNames(depute.firstname, depute.lastname)}`}>
                    <a className={styles.block} onClick={onClick}>
                        {' '}
                        {content}
                    </a>
                </Link>
            ) : (
                <div className={styles.block} onClick={onClick}>
                    {content}
                </div>
            )}

            {detailed && <DeputeBlockDetails depute={depute as Depute} />}
        </>
    );
};
