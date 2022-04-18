import React from 'react';
import Link from 'next/link';
import { slugify } from '$helpers/slugify';
import { BaseDepute } from '$types/deputeTypes';

export const DeputeBlock: React.FC<{ depute: BaseDepute }> = ({ depute }) => {
    return (
        <Link href={`/deputes/${slugify(`${depute.firstname} ${depute.lastname}`)}`}>
            <a>
                {depute.firstname} {depute.lastname}
                <p>
                    Circonscription: {depute.circumscription} de {depute.county}
                </p>
                <img
                    src={`/img/deputes/${slugify(depute.firstname + ' ' + depute.lastname)}.jpg`}
                    alt=""
                />
            </a>
        </Link>
    );
};
