import {colors, groups} from "$components/depute/DeputeBlock/colors";
import styles from "$components/depute/DeputeBlock/DeputeBlock.module.css";
import React from "react";
import {Candidate} from "$types/deputeTypes";

export const NuanceBlock: React.FC<{candidate: Candidate}> = ({ candidate}) => {
    return candidate.party ? <div className={styles.nuance}>
        {groups[candidate.nuanceComputed] && groups[candidate.nuanceComputed] !== 'Rassemblement national' && (
            <div className={styles.grouping}>
                {groups[candidate.nuanceComputed]}
            </div>
        )}
        <div
            className={styles.parti}
            style={{ background: colors[candidate.nuanceComputed] }}
        >
            {candidate.party}
        </div>
    </div> : null
}
