import styles from './DeputeTop.module.css';
import { Title } from '$components/text/Title/Title';
import { DeputeBlock } from '$components/depute/DeputeBlock/DeputeBlock';
import { DeputeVoteCategories } from '$components/depute/DeputeVoteCategories/DeputeVoteCategories';
import { DeputeDetails } from '$components/depute/DeputeDetails/DeputeDetails';
import React, { ReactNode, useState } from 'react';
import { Depute } from '$types/deputeTypes';
import { cn } from '$helpers/cn';
import { AiFillFacebook, AiFillTwitterCircle, AiOutlineShareAlt } from 'react-icons/ai';
import { Button } from '$components/buttons/Button/Button';
import { Share } from '$components/buttons/Share/Share';

export const DeputeTop: React.FC<{
    id?: string;
    title?: string;
    depute: Depute;
    children?: ReactNode | ReactNode[];
    className?: string;
    noCounty?: boolean;
}> = ({ id, title, depute, children, className, noCounty }) => {
    return (
        <section id={id} className={cn(className, styles.top)}>
            {title && <Title size={'big'}>{title}</Title>}
            <DeputeBlock className={styles.depute} depute={depute} noCounty={noCounty} showGroup />
            <Share url={process.env.NEXT_PUBLIC_HOST + '/deputes/' + depute.slug} />
            <DeputeVoteCategories className={styles.votes} depute={depute} />
            <DeputeDetails className={styles.details} depute={depute}>
                {children}
            </DeputeDetails>
        </section>
    );
};
