import styles from './Breadcrumb.module.css'
import React from 'react';
import Link from "next/link";

export const Breadcrumb: React.FC<{items: { label: string; href?: string}[]}> = ({items}) => {

    return <nav className={styles.breadcrumb}>
        <ul>
            {items.map(i => {
                return <li key={i.label}>{i.href ? <Link href={i.href}><a>{i.label}</a></Link> : <span>{i.label}</span>}</li>;
            })}
        </ul>
    </nav>
}