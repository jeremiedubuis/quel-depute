import styles from './Button.module.css';
import React from 'react';
import type { ReactNode } from 'react';
import { cn } from '$helpers/cn';
import type { IconType } from 'react-icons/lib';
import Link from 'next/link';

type AuthorizedElements = HTMLButtonElement | HTMLLinkElement;

type ButtonProps<T extends AuthorizedElements> = React.HTMLProps<T> & {
    children?: ReactNode | ReactNode[];
    icon?: IconType;
    type?: 'button' | 'reset' | 'submit';
};

export const Button = <T extends AuthorizedElements = HTMLButtonElement>({
    children,
    type,
    icon: Icon,
    href,
    className,
    ...props
}: ButtonProps<T>) => {
    const Tag = href ? 'a' : 'button';

    const content = (
        //@ts-ignore
        <Tag type={type} className={cn(styles.button, className)} {...props}>
            {Icon && <Icon />}
            {children}
        </Tag>
    );

    return href ? <Link href={href}>{content}</Link> : content;
};
