import { BaseDepute } from '$types/deputeTypes';

export type CircumscriptionType = {
    countyId: string;
    number: number;
    name: string;
    candidates: BaseDepute[];
    results: {
        firstRound: {
            expressed: number;
            registered: number;
            voted: number;
            whites: number;
            void: number;
            candidates: { [name: string]: number }[];
        };
    };
};