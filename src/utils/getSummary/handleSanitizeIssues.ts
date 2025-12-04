/**
 * Logs sanitize issues if present.
 */
export function handleSanitizeIssues(issues: string[]): void {
    if (issues.length === 0) return;

    console.warn("Issues detected and sanitized in fetched recipes summary:", issues);
}
