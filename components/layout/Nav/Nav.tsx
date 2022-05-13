import styles from './Nav.module.css';
import Link from 'next/link';
import React from 'react';
import { cn } from '$helpers/cn';

const entries = [
    { label: 'Les Députés', href: '/deputes' },
    { label: 'Votes', href: '/votes' },
    //{ label: 'Législatives', href: '/legislatives' }
];

export const Nav: React.FC<{ primary?: boolean; className?: string }> = ({
    primary,
    className,
}) => {
    return (
        <nav className={cn(styles.nav, primary && styles.primary, className)}>
            <ul>
                {entries.map((e) => (
                    <li key={e.href}>
                        <Link href={e.href}>
                            <a>{e.label}</a>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
