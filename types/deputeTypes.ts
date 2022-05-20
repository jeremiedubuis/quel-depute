export type BaseDepute = {
    id: string;
    firstname: string;
    lastname: string;
    group: string;
    groupShort: string;
    county: string;
    countyId: number;
    circumscription: number;
    slug: string;
};

export type VoteValue = 'Absent' | 'Pour' | 'Contre' | 'Abstention' | 'Non-votant';

export type PresenceType = {
    weeksActive: number;
    reports: number;
    proposals: number;
    proposalsSupported: number;
    amendments: number;
    amendmentsSupported: number;
    amendmentsAdopted: number;
    commissionsAttended: number;
    commissionInterventions: number;
    hemicycleInterventions: number;
    hemicycleShortInterventions: number;
    questionsWritten: number;
    questionsOral: number;
};

export type DeputeVote = {
    name: string;
    category: string;
    vote: VoteValue;
    weight?: number;
    impactModifier: number;
    notes?: string;
};

export type Scandal = {
    type: 'Accusations sans poursuites' | 'Enquête' | 'Mise en examen' | 'Condamnation';
    subjects: string[];
};

export type Depute = BaseDepute & {
    gender: 'H' | 'F';
    job: string;
    mandateStart: string;
    birthday: string;
    birthPlace: string;
    votes: DeputeVote[];
    presence: PresenceType;
    presenceAverage: PresenceType;
    firstRoundResults?: {
        registered: number;
        voted: number;
        whites: number;
        void: number;
        candidates: {
            [name: string]: number;
        };
    };
    votedAsGroup: number;
    supportedGovernment: number;
    opposedGovernment: number;
    governmentLaws: number;
    scandals: Scandal[];
};
