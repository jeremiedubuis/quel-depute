import styles from './HorizontalBars.module.css';
import React from 'react';
import { cn } from '$helpers/cn';

type HorizontalBarsProps = {
    lines: { title: string; amounts: number[]; total: number }[];
    colors?: string[];
    tooltip?: boolean;
    labels?: string[];
    after?: (percentages: number[]) => any;
};

export const HorizontalBars: React.FC<HorizontalBarsProps> = ({
    lines,
    colors,
    tooltip,
    labels,
    after
}) => {
    return (
        <ul>
            {lines
                .sort((a, b) => (a.amounts[0] < b.amounts[0] ? 1 : -1))
                .map(({ title, amounts, total }) => {
                    const percentages = amounts.map((amount) => (amount / total) * 100);
                    return (
                        <li key={title}>
                            {title}
                            <div
                                className={cn(
                                    styles.percentage,
                                    percentages.length > 1 && styles.multiple,
                                    tooltip && styles.tooltip
                                )}
                            >
                                {percentages.map((percentage, i) => (
                                    <div
                                        className={styles.bar}
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: colors?.[i],
                                            left: `${percentages
                                                .slice(0, i)
                                                .reduce((acc, curr) => acc + curr, 0)}%`
                                        }}
                                    >
                                        <span>
                                            {labels?.[i]} ({percentage.toFixed(2)}%)
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {after?.(percentages)}
                        </li>
                    );
                })}
        </ul>
    );
};
