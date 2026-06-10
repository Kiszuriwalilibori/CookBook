// import { writeClient } from "@/utils";
// import { ApiError } from "./comment.service";

// type HandleLikeInput = {
//     commentId: string;
//     fingerprint: string;
// };

// function validateInput(input: HandleLikeInput) {
//     const { commentId, fingerprint } = input;

//     if (!commentId || !fingerprint) {
//         throw new ApiError("INVALID_INPUT", "Brak odcisku palca lub id komentarza", 404);
//     }
// }

// async function getCommentOrThrow(commentId: string) {
//     // const comment = await writeClient.getDocument(commentId);
//     const comment = await writeClient.getDocument<{ likes?: string[] }>(commentId);

//     if (!comment) {
//         throw new ApiError("COMMENT_NOT_FOUND", "Nie znaleziono komentarza, który pragniesz polubić", 404);
//     }

//     return comment;
// }

// function getLikeState(comment: { likes?: string[] }, fingerprint: string) {
//     const likes = comment.likes ?? [];

//     return {
//         likes,
//         alreadyLiked: likes.includes(fingerprint),
//     };
// }

// function getUpdatedLikes(likes: string[], fingerprint: string, alreadyLiked: boolean) {
//     return alreadyLiked ? likes.filter(f => f !== fingerprint) : [...likes, fingerprint];
// }

// async function persistLikes(commentId: string, fingerprint: string, updatedLikes: string[], alreadyLiked: boolean) {
//     if (alreadyLiked) {
//         await writeClient.patch(commentId).set({ likes: updatedLikes }).commit();

//         return;
//     }

//     await writeClient.patch(commentId).setIfMissing({ likes: [] }).append("likes", [fingerprint]).commit();
// }

// export async function handleLike(input: HandleLikeInput) {
//     validateInput(input);

//     const comment = await getCommentOrThrow(input.commentId);

//     const { likes, alreadyLiked } = getLikeState(comment, input.fingerprint);

//     const updatedLikes = getUpdatedLikes(likes, input.fingerprint, alreadyLiked);

//     await persistLikes(input.commentId, input.fingerprint, updatedLikes, alreadyLiked);

//     return {
//         commentId: input.commentId,
//         likes: updatedLikes,
//         liked: !alreadyLiked,
//     };
// }
import { writeClient } from "@/utils";
import { ApiError } from "./comment.service";

type HandleLikeArgs = {
    commentId: string;
    fingerprint: string;
};

function validateInput(args: HandleLikeArgs) {
    const { commentId, fingerprint } = args;

    if (!commentId || !fingerprint) {
        throw new ApiError("INVALID_INPUT", "Brak odcisku palca lub id komentarza", 400);
    }
}

async function getComment(commentId: string) {
    const comment = await writeClient.getDocument<{ likes?: string[] }>(commentId);

    if (!comment) {
        throw new ApiError("COMMENT_NOT_FOUND", "Nie znaleziono komentarza, który pragniesz polubić", 404);
    }

    return comment;
}

function getLikeState(comment: { likes?: string[] }, fingerprint: string) {
    const likes = comment.likes ?? [];

    return {
        likes,
        alreadyLiked: likes.includes(fingerprint),
    };
}

function getUpdatedLikes(likes: string[], fingerprint: string, alreadyLiked: boolean): string[] {
    return alreadyLiked ? likes.filter(f => f !== fingerprint) : [...likes, fingerprint];
}

async function saveLikes(commentId: string, fingerprint: string, updatedLikes: string[], alreadyLiked: boolean) {
    if (alreadyLiked) {
        await writeClient.patch(commentId).set({ likes: updatedLikes }).commit();
    } else {
        await writeClient.patch(commentId).setIfMissing({ likes: [] }).append("likes", [fingerprint]).commit();
    }
}

export async function handleLike(args: HandleLikeArgs) {
    validateInput(args);

    const comment = await getComment(args.commentId);

    const { likes, alreadyLiked } = getLikeState(comment, args.fingerprint);

    const updatedLikes = getUpdatedLikes(likes, args.fingerprint, alreadyLiked);

    await saveLikes(args.commentId, args.fingerprint, updatedLikes, alreadyLiked);

    return {
        commentId: args.commentId,
        likes: updatedLikes,
        liked: !alreadyLiked,
    };
}
