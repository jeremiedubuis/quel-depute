import styles from './Field.module.css';
import React, { RefObject } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../../helpers/cn';

export type FieldProps = {
    label?: string;
    id?: string;
    children?: ReactNode | ReactNode[];
    className?: string;
    wrapperRef?: RefObject<HTMLDivElement>;
};

export const Field: React.FC<FieldProps> = ({ children, label, id, className, wrapperRef }) => {
    return (
        <div className={cn(styles.field, className)} ref={wrapperRef}>
            {label && <label htmlFor={id}>{label}</label>}
            {children}
        </div>
    );
};
