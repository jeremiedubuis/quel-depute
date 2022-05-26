import styles from './DeputeBlock.module.css';
import React, { MouseEventHandler } from 'react';
import Link from 'next/link';
import { slugify, slugifyNames } from '$helpers/slugify';
import { BaseDepute, Candidate, Depute } from '$types/deputeTypes';
import { DeputeBlockCircumscription } from '$components/depute/DeputeBlock/DeputeBlockCircumscription';
import { cn } from '$helpers/cn';

export const DeputeBlock: React.FC<{
    depute: Candidate | BaseDepute | Depute;
    isLink?: boolean;
    isLinkToCircumscription?: boolean;
    TitleTag?: keyof JSX.IntrinsicElements;
    onClick?: MouseEventHandler;
    noCounty?: boolean;
    className?: string;
}> = ({
    depute,
    isLink,
    TitleTag = 'h3',
    onClick,
    noCounty,
    isLinkToCircumscription,
    className,
}) => {
    const content = (
        <>
            {!depute.noPicture && (
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
            <img className={styles.group} src={`/img/groups/${depute.groupShort}.svg`} alt="" />
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
