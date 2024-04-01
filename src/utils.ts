export function isShortName(name: string): boolean {
    return /:.+:/.test(name);
}