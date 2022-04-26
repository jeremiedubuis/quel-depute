import styles from './ProgressCircle.module.css';
import React, { useEffect } from 'react';

const getPoint = (
    percentage: number,
    radius: number,
    center: [x: number, y: number]
): [x: number, y: number] => {
    const celsius = (percentage / 100) * 360 + 180;
    const rads = -celsius * (Math.PI / 180);
    const x = radius * Math.sin(rads) + center[0];
    const y = radius * Math.cos(rads) + center[1];
    return [x, y];
};

const percentageToClipPath = (percentage: number) => {
    const p = getPoint(percentage, 100, [50, 50]);
    const points = ['50% 50%', '50% -100%'];
    if (percentage > 25) points.push('200% 50%');
    if (percentage > 50) points.push('50% 200%');
    if (percentage > 75) points.push('-100% 50%');

    points.push(`${p[0]}% ${p[1]}%`);

    points.push('50% 50%');

    return `polygon(${points.join(',')})`;
};
export const ProgressCircle: React.FC<{ percentage: number }> = ({ percentage }) => {
    return (
        <>
            <div className={styles.progress}>
                <div className={styles.background}>{percentage}%</div>
                <div
                    className={styles.circle}
                    style={{
                        clipPath: percentageToClipPath(percentage)
                    }}
                />
            </div>
        </>
    );
};
