import { Candidate, Depute} from '$types/deputeTypes';

type ElectionsRound = {
    expressed: number;
    registered: number;
    voted: number;
    whites: number;
    void: number;
};

type ElectionsRound2017 = ElectionsRound & { candidates: { [name: string]: number }[]; }

export type CircumscriptionType = {
    countyId: number;
    number: number;
    name: string;
    current: Depute;
    candidates: Candidate[];
    results: {
        '2017': {
            firstRound: ElectionsRound2017;
            secondRound: ElectionsRound2017;
        },
        '2022': {
            firstRound: ElectionsRound;
        }
    };
};
