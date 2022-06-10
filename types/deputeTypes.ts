export type BaseDepute = {
    id: string;
    firstname: string;
    lastname: string;
    group: string;
    groupShort: string;
    party?: string;
    partyShort?: string;
    noPartyImage?: boolean;
    county: string;
    countyId: string;
    circumscription: number;
    slug: string;
    noPicture?: boolean;
    nuance?: string;
};

export type Candidate = {
    firstname: string;
    lastname: string;
    party: string;
    partyShort: string;
    noPartyImage?: boolean;
    nuance: string;
    nuanceComputed: string;
    gender: 'H' | 'F' | 'N';
    noPicture?: boolean;
    countyId: string;
    county: string;
    circumscription: number;
    candidate: boolean;
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
    number: number;
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
    candidate:
        | false
        | {
              countyId: string;
              county: string;
              circumscription: number;
              circumscriptionSlug: string;
          };
    gender: 'H' | 'F' | 'N';
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
        expressed: number;
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
