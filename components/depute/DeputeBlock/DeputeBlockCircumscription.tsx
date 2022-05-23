import styles from "$components/depute/DeputeBlock/DeputeBlock.module.css";
import {FiMapPin} from "react-icons/fi";
import React from "react";
import {BaseDepute} from "$types/deputeTypes";

export const DeputeBlockCircumscription: React.FC<{ depute: BaseDepute }> = ({ depute }) => <div className={styles.circumscription}>
    <FiMapPin />
    <p>
        {depute.county} ({depute.countyId})
    </p>
    <p>
        {depute.circumscription}
        <sup>e</sup> circonscription
    </p>
</div>