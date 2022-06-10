export function pad(num: number | string, size: number) {
    let str = num.toString();
    while (str.length < size) str = '0' + str;
    return str;
}
