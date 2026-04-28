import { createClient } from "@sanity/client";

export const client = createClient({
    projectId: "mextu0pu",
    dataset: "production",
    apiVersion: "2024-10-14",
    token: "sk1nR4QlkQkoos5EeELATh3BSd5FiOnShQgS4UZxVpYzsKq8Brz99diSrvaxtXzF5hUhLrbQNyvclwPHAQ9kC1a0K2PGh7SclYOmgDGLYchbtVamslHckgPM2sthdRYe3ok3MGpgWQ0rZB7276ekDVc8Apl6odxR3teKhobZnPFa0XH1TrVV", // 🔐 NIE hardkoduj
    useCdn: false,
});
async function deleteAllRecipeComments() {
    const tx = client.transaction();

    const comments = await client.fetch(`
    *[_type == "recipeComment"]{_id}
  `);

    for (const comment of comments) {
        tx.delete(comment._id);
    }

    await tx.commit();
    console.log(`Deleted ${comments.length} comments`);
}

deleteAllRecipeComments();
