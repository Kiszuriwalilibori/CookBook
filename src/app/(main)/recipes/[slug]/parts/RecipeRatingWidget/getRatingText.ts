export function getRatingsText(count: number): string {
    return count === 1 ? "ocena" : count < 5 ? "oceny" : "ocen";
}
