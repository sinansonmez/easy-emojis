export function isShortName(name: string) {
    return /:.+:/.test(name);
}