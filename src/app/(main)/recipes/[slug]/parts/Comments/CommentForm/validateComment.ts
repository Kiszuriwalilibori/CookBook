export function validateComment({ author, content }: { author: string; content: string }) {
    const authorErrors: string[] = [];
    const contentErrors: string[] = [];

    const trimmedAuthor = author.trim();
    const trimmedContent = content.trim();

    // ==================== AUTHOR ====================
    if (trimmedAuthor.length < 2) authorErrors.push("author_too_short");
    if (trimmedAuthor.length > 40) authorErrors.push("author_too_long");

    // ==================== CONTENT ====================
    if (trimmedContent.length < 3) contentErrors.push("content_too_short");
    if (trimmedContent.length > 1000) contentErrors.push("content_too_long");

    // whitespace only
    if (!trimmedContent) contentErrors.push("empty_content");

    // repeated chars
    if (/(.)\1{5,}/.test(trimmedContent)) {
        contentErrors.push("too_many_repeated_chars");
    }

    // links
    const urlMatches = trimmedContent.match(/https?:\/\/|www\./gi) || [];
    if (urlMatches.length > 1) {
        contentErrors.push("too_many_links");
    }

    // html
    if (/<[^>]+>/.test(trimmedContent)) {
        contentErrors.push("html_detected");
    }

    // uppercase ratio
    const letters = trimmedContent.replace(/[^a-zA-Z]/g, "");
    if (letters.length > 10) {
        const upper = letters.replace(/[^A-Z]/g, "").length;
        if (upper / letters.length > 0.7) {
            contentErrors.push("too_much_caps");
        }
    }

    // blacklist
    const banned = ["viagra", "casino", "crypto", "bitcoin", "xxx"];
    const lower = trimmedContent.toLowerCase();
    if (banned.some(word => lower.includes(word))) {
        contentErrors.push("banned_word");
    }

    const isValid = authorErrors.length === 0 && contentErrors.length === 0;

    return {
        isValid,
        authorErrors,
        contentErrors,
    };
}

export default validateComment;
