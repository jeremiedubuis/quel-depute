export const cn = (...classes: (string | null | undefined | false | number)[]) =>
    classes.filter((c) => c).join(' ');
