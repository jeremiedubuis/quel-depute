import { BaseDepute, Depute } from '$types/deputeTypes';

type ElectionsRound = {
    expressed: number;
    registered: number;
    voted: number;
    whites: number;
    void: number;
    candidates: { [name: string]: number }[];
};

export type CircumscriptionType = {
    countyId: number;
    number: number;
    name: string;
    current: Depute;
    candidates: BaseDepute[];
    results: {
        firstRound: ElectionsRound;
        secondRound: ElectionsRound;
    };
};
