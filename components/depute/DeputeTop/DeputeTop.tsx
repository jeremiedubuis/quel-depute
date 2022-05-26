import styles from "./DeputeTop.module.css";
import {Title} from "$components/text/Title/Title";
import {DeputeBlock} from "$components/depute/DeputeBlock/DeputeBlock";
import {DeputeVoteCategories} from "$components/depute/DeputeVoteCategories/DeputeVoteCategories";
import {DeputeDetails} from "$components/depute/DeputeDetails/DeputeDetails";
import React, {ReactNode} from "react";
import {Depute} from "$types/deputeTypes";
import {cn} from "$helpers/cn";

export const DeputeTop: React.FC<{ title?: string; depute: Depute; children?: ReactNode | ReactNode[]; className?: string;}> = ({ title, depute, children, className}) => {
    return <section className={cn(className, styles.top)}>
        {title && <Title size={'big'}>{title}</Title>}
        <DeputeBlock className={styles.depute} depute={depute} noCounty  />
        <DeputeVoteCategories className={styles.votes} depute={depute} />
        <DeputeDetails className={styles.details} depute={depute}>{children}</DeputeDetails>
    </section>
}