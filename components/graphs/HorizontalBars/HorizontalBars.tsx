import styles from './HorizontalBars.module.css';
import React, { ReactNode } from 'react';
import { cn } from '$helpers/cn';

type Line = { title: string; amounts: number[]; total: number; colors?: string[] };
type HorizontalBarsProps = {
    lines: Line[];
    className?: string;
    tooltip?: boolean;
    labels?: string[];
    after?: (percentages: number[]) => any;
    colors?: string[];
    renderLabel?: (data: Line & { i: number; percentage: number }) => ReactNode | ReactNode[];
};

export const HorizontalBars: React.FC<HorizontalBarsProps> = ({
    lines,
    tooltip,
    className,
    labels,
    renderLabel,
    after,
    colors,
}) => {
    return (
        <ul className={cn(styles.bars, className)}>
            {lines
                .sort((a, b) => (a.amounts[0] < b.amounts[0] ? 1 : -1))
                .map((line, i) => {
                    const { title, amounts, total, colors: lineColors } = line;
                    const percentages = amounts.map((amount) => (amount / total) * 100);
                    return (
                        <li key={title || i}>
                            {title && <div className={styles.title}>{title}</div>}
                            <div
                                className={cn(
                                    styles.percentage,
                                    percentages.length > 1 && styles.multiple,
                                    tooltip && styles.tooltip,
                                )}
                            >
                                {percentages.map((percentage, i) => (
                                    <div
                                        key={i}
                                        className={styles.bar}
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: lineColors?.[i] || colors?.[i],
                                            left: `${percentages
                                                .slice(0, i)
                                                .reduce((acc, curr) => acc + curr, 0)}%`,
                                        }}
                                    >
                                        <span>
                                            {renderLabel ? (
                                                renderLabel({ ...line, i, percentage })
                                            ) : (
                                                <>
                                                    {labels?.[i]} ({percentage.toFixed(2)}%)
                                                </>
                                            )}
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
