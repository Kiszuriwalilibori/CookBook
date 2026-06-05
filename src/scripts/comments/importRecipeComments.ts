import { nanoid } from "nanoid";
import { createClient } from "@sanity/client";

export const writeClient = createClient({
    projectId: "mextu0pu",
    dataset: "production",
    apiVersion: "2024-10-14",
    token: "sk1nR4QlkQkoos5EeELATh3BSd5FiOnShQgS4UZxVpYzsKq8Brz99diSrvaxtXzF5hUhLrbQNyvclwPHAQ9kC1a0K2PGh7SclYOmgDGLYchbtVamslHckgPM2sthdRYe3ok3MGpgWQ0rZB7276ekDVc8Apl6odxR3teKhobZnPFa0XH1TrVV", // 🔐 NIE hardkoduj
    useCdn: false,
});

interface ImportedComment {
    author: string;
    parentId: string | null;

    content: string;
    createdAt: string;

    fingerprint: string;
    likes: string[];

    isAdmin?: boolean;

    shortComment?: {
        content: string;
        createdAt: string;
    } | null;
}

interface ImportRecipeCommentsInput {
    recipeTitle: string;
    comments: ImportedComment[];
    overwrite?: boolean;
}

export async function importRecipeComments({ recipeTitle, comments, overwrite = false }: ImportRecipeCommentsInput) {
    const recipe = await writeClient.fetch(
        `*[_type == "recipe" && title == $title][0]{
            _id,
            title
        }`,
        {
            title: recipeTitle,
        }
    );

    if (!recipe) {
        throw new Error(`Nie znaleziono przepisu o tytule "${recipeTitle}"`);
    }

    const existingComments: { _id: string }[] = await writeClient.fetch(
        `*[
                _type == "recipeComment"
                && recipeId == $recipeId
            ]{
                _id
            }`,
        {
            recipeId: recipe._id,
        }
    );

    if (existingComments.length > 0) {
        if (!overwrite) {
            throw new Error(`Przepis "${recipeTitle}" posiada już ${existingComments.length} komentarzy. Użyj overwrite: true jeśli chcesz je zastąpić.`);
        }

        console.log(`🗑️ Usuwam ${existingComments.length} istniejących komentarzy dla "${recipeTitle}"`);

        await Promise.all(existingComments.map(comment => writeClient.delete(comment._id)));
    }

    let created = 0;

    for (const comment of comments) {
        await writeClient.create({
            _id: `comment-${nanoid()}`,
            _type: "recipeComment",

            recipeId: recipe._id,

            parentId: comment.parentId ?? null,

            content: comment.content,
            author: comment.author,

            isAdmin: comment.isAdmin ?? false,

            createdAt: comment.createdAt,

            fingerprint: comment.fingerprint,

            likes: comment.likes ?? [],

            shortComment: comment.shortComment === undefined ? null : comment.shortComment,
        });

        created++;
    }

    console.log(`✅ Dodano ${created} komentarzy do przepisu "${recipe.title}"`);
}
