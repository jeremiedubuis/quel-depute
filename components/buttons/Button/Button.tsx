import styles from './Button.module.css';
import React from 'react';
import type { ReactNode } from 'react';
import { cn } from '$helpers/cn';
import type { IconType } from 'react-icons/lib';

export const Button: React.FC<
    React.HTMLProps<HTMLButtonElement> & {
        children?: ReactNode | ReactNode[];
        icon?: IconType;
        type?: 'button' | 'reset' | 'submit';
    }
> = ({ children, type, icon: Icon, ...props }) => {
    return (
        <button type={type} className={cn(styles.button)} {...props}>
            {Icon && <Icon />}
            {children}
        </button>
    );
};
