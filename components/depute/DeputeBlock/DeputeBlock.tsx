import styles from './DeputeBlock.module.css';
import React, { MouseEventHandler } from 'react';
import Link from 'next/link';
import { slugifyNames } from '$helpers/slugify';
import { BaseDepute, Depute } from '$types/deputeTypes';
import { FiMapPin } from 'react-icons/fi';
import { Title } from '$components/text/Title/Title';
import { DeputeBlockDetails } from '$components/depute/DeputeBlock/DeputeBlockDetails';

export const DeputeBlock: React.FC<{
    depute: BaseDepute | Depute;
    isLink?: boolean;
    TitleTag?: keyof JSX.IntrinsicElements;
    onClick?: MouseEventHandler;
    detailed?: boolean;
}> = ({ depute, isLink, TitleTag = 'h3', onClick, detailed }) => {
    const content = (
        <>
            <div
                className={styles.picture}
                style={{
                    backgroundImage: `url(/img/deputes/${slugifyNames(
                        depute.firstname,
                        depute.lastname
                    )}.jpg)`
                }}
            />
            <TitleTag className={styles.title}>
                <span>{depute.firstname}</span> <span>{depute.lastname}</span>
            </TitleTag>
            <div className={styles.circumscription}>
                <FiMapPin />
                <p>
                    {depute.county} ({depute.countyId})
                </p>
                <p>
                    {depute.circumscription}
                    <sup>e</sup> circonscription
                </p>
            </div>

            <img className={styles.group} src={`/img/groups/${depute.groupShort}.svg`} alt="" />

            {detailed && <DeputeBlockDetails depute={depute as Depute} />}
        </>
    );

    return isLink ? (
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
    );
};
