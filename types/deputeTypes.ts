export type BaseDepute = {
    id: number;
    firstname: string;
    lastname: string;
    group: string;
    groupShort: string;
    region: string;
    county: string;
    countyId: number;
    circumscription: number;
};

export type Depute = BaseDepute & {
    slug: string;
    votes: {
        [vote: string]: {
            vote: string;
            weight: number;
        };
    };
    firstRoundResults?: {
        registered: number;
        voted: number;
        whites: number;
        void: number;
        candidates: {
            [name: string]: number;
        };
    };
};
