import { Depute } from '$types/deputeTypes';

export type BaseScrutin = {
    number: number;
    title: string;
    category: string;
    href: string;
    slug: string;
    initiative: string;
    impactModifier: 1 | -1;
};

export type ScrutinType = BaseScrutin & {
    authors: Depute[];
    votes: {
        firstname: string;
        lastname: string;
        delegation: boolean;
        group: string;
        groupShort: string;
        vote: 'Pour' | 'Contre' | 'Abstention' | 'Non-votant';
    }[];
};
