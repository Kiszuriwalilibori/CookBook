export function validateComment({ author, content }: { author: string; content: string }) {
    const errors: string[] = [];

    const trimmedAuthor = author.trim();
    const trimmedContent = content.trim();

    // 1. length
    if (trimmedAuthor.length < 2) errors.push("author_too_short");
    if (trimmedAuthor.length > 40) errors.push("author_too_long");

    if (trimmedContent.length < 3) errors.push("content_too_short");
    if (trimmedContent.length > 1000) errors.push("content_too_long");

    // 2. whitespace only
    if (!trimmedContent) errors.push("empty_content");

    // 3. repeated chars
    if (/(.)\1{5,}/.test(trimmedContent)) {
        errors.push("too_many_repeated_chars");
    }

    // 4. links
    const urlMatches = trimmedContent.match(/https?:\/\/|www\./gi) || [];
    if (urlMatches.length > 1) {
        errors.push("too_many_links");
    }

    // 5. html
    if (/<[^>]+>/.test(trimmedContent)) {
        errors.push("html_detected");
    }

    // 6. uppercase ratio
    const letters = trimmedContent.replace(/[^a-zA-Z]/g, "");
    if (letters.length > 10) {
        const upper = letters.replace(/[^A-Z]/g, "").length;
        if (upper / letters.length > 0.7) {
            errors.push("too_much_caps");
        }
    }

    // 7. blacklist
    const banned = ["viagra", "casino", "crypto", "bitcoin", "xxx"];
    const lower = trimmedContent.toLowerCase();
    if (banned.some(word => lower.includes(word))) {
        errors.push("banned_word");
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}
export default validateComment;
