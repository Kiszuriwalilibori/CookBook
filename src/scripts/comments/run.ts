import { comments } from "./comments";
import { importRecipeComments } from "./importRecipeComments";

async function main() {
    await importRecipeComments({
        recipeTitle: "Chłodnik litewski",
        comments,
        overwrite: false,
    });
}

main().catch(console.error);

// todo pary warzywa-warzywne
// todo. mam wrażenie, że przy dodawaniu pierwszej w danej rcepcie odpowiedzi typu short comment ona się nie wyświetla od razu tylko wymaga przeładowania. Zaobserowawane przy hurtowym dodawaniu komentarzy
