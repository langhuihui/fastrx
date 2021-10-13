export function pipe(first, ...cbs) {
    return cbs.reduce((aac, c) => c(aac), first);
}
