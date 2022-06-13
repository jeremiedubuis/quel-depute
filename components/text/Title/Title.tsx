import styles from './Title.module.css';
import React from 'react';
import { cn } from '$helpers/cn';

export const Title: React.FC<{
    className?: string;
    children: React.ReactNode | React.ReactNode[];
    TitleTag?: keyof JSX.IntrinsicElements;
    size: 'small' | 'medium' | 'medium-big' | 'big' | 'biggest';
}> = ({ children, TitleTag = 'h2', size, className }) => {
    return <TitleTag className={cn(styles.title, styles[size], className)}>{children}</TitleTag>;
};
