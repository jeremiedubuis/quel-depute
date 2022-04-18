import styles from './Field.module.css';
import React from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../../helpers/cn';

export type FieldProps = {
    label?: string;
    id?: string;
    children?: ReactNode | ReactNode[];
    className?: string;
};

export const Field: React.FC<FieldProps> = ({ children, label, id, className }) => {
    return (
        <div className={cn(styles.field, className)}>
            {label && <label htmlFor={id}>{label}</label>}
            {children}
        </div>
    );
};
