export const slugify = (...args: (string | number)[]): string => {
    const value = args.join(' ');

    return value
        .normalize('NFD') // split an accented letter in the base letter and the acent
        .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
        .replace(/\s+/g, '-'); // separator
};

export const slugifyNames = (firstname:string , lastname:string) => {
    if (lastname.endsWith(' (de)')) {
        lastname =  'de '+lastname.replace(' (de)', '');
    }
    return slugify(`${firstname} ${lastname}`)
}
