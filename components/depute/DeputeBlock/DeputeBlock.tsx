import styles from './DeputeBlock.module.css';
import React from 'react';
import Link from 'next/link';
import { slugify } from '$helpers/slugify';
import { BaseDepute } from '$types/deputeTypes';
import { FiMapPin } from 'react-icons/fi';

export const DeputeBlock: React.FC<{
    depute: BaseDepute;
    isLink?: boolean;
    TitleTag?: keyof JSX.IntrinsicElements;
}> = ({ depute, isLink, TitleTag = 'h3' }) => {
    const content = (
        <>
            <div
                className={styles.picture}
                style={{
                    backgroundImage: `url(/img/deputes/${slugify(
                        depute.firstname + ' ' + depute.lastname
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
        </>
    );

    return isLink ? (
        <Link href={`/deputes/${slugify(`${depute.firstname} ${depute.lastname}`)}`}>
            <a className={styles.block}> {content}</a>
        </Link>
    ) : (
        <div className={styles.block}>{content}</div>
    );
};
