export const errorMessages: Record<string, string> = {
    author_too_short: "Imię jest za krótkie",
    author_too_long: "Imię jest za długie",

    content_too_short: "Komentarz jest za krótki",
    content_too_long: "Komentarz jest za długi",

    empty_content: "Komentarz nie może być pusty",

    too_many_repeated_chars: "Zbyt wiele powtarzających się znaków",
    too_many_links: "Za dużo linków w komentarzu",

    html_detected: "HTML nie jest dozwolony",
    too_much_caps: "Zbyt dużo wielkich liter",

    banned_word: "Komentarz zawiera niedozwolone słowa",
};
export default errorMessages;
