import { slugify } from '$helpers/slugify';

export const variableNames = [
    ['Am\u00e9lia Lakrafi', 'Amal-Amélia Lakrafi', 'Amélia Lakrafi'],
    ['Audrey Dufeu Schubert', 'Audrey Dufeu'],
    ['Charlotte Parmentier-Lecocq', 'Charlotte Lecocq'],
    ['Christine Cloarec-Le Nabour', 'Christine Cloarec'],
    ['Florence Lasserre-David', 'Florence Lasserre'],
    ['Laurence Vanceunebrock-Mialon', 'Laurence Vanceunebrock'],
    ['Monica Michel', 'Monica Michel-Brassart'],
    ['Vincent Descœur', 'Vincent Descoeur'],
    ['Yannick Favennec-B\u00e9cot', 'Yannick Favennec Becot'],
];

export const testNameAndVariation = (name, equalityCheck) => {
    if (slugify(name) === slugify(equalityCheck)) return true;
    const i = variableNames.findIndex((n) => n.includes(name));
    if (i === -1) return false;
    return !!variableNames[i].find((n) => n === equalityCheck);
};
