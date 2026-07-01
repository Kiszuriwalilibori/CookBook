import { nanoid } from "nanoid";
import { analyzeComment, writeClient } from "@/utils";
import { checkCommentCooldown } from "@/app/(main)/recipes/[slug]/parts/Comments/utils";
import { getUserFromCookies } from "@/utils/server/getUserFromCookies";

type CreateCommentInput = {
    recipeId: string;
    content: string;
    author: string;
    fingerprint: string;
    parentId?: string;
    website?: string;
};

export class ApiError extends Error {
    status: number;
    code: string;

    constructor(code: string, message: string, status = 400) {
        super(message);
        Object.setPrototypeOf(this, ApiError.prototype);
        this.code = code;
        this.status = status;
    }
}

function assertNotSpam(website?: string) {
    if (website) {
        throw new ApiError("SPAM_DETECTED", "Wykryto próbę spamu", 400);
    }
}

function validateInput(input: CreateCommentInput) {
    const { recipeId, content, author, fingerprint } = input;

    if (!recipeId || !content?.trim() || !author || !fingerprint) {
        throw new ApiError("MISSING_FIELDS", "Brak wymaganych pól", 400);
    }
}

async function assertParentValid(parentId?: string, recipeId?: string) {
    if (!parentId) return;

    const parent = await writeClient.getDocument(parentId);

    if (!parent || parent.recipeId !== recipeId) {
        throw new ApiError("INVALID_PARENT", "Nieprawidłowy komentarz nadrzędny", 400);
    }
}

async function assertCooldown(fingerprint: string) {
    const cooldown = await checkCommentCooldown(fingerprint);

    if (!cooldown.allowed) {
        throw new ApiError("COMMENT_COOLDOWN", `Odczekaj ${cooldown.remainingSeconds} sekund`, 429);
    }
}

async function moderate(content: string) {
    const result = await analyzeComment(content);

    if (!result.valid) {
        throw new ApiError("COMMENT_REJECTED", "Komentarz nie przeszedł moderacji", 400);
    }

    // return result;
}

function buildComment(input: CreateCommentInput, isAdmin: boolean) {
    return {
        _type: "recipeComment",
        _id: `comment-${nanoid()}`,

        recipeId: input.recipeId,
        parentId: input.parentId || null,

        content: input.content.trim(),
        author: input.author,
        isAdmin,

        createdAt: new Date().toISOString(),
        fingerprint: input.fingerprint,
        likes: [],
    };
}

export async function createComment(input: CreateCommentInput) {
    // 1. spam
    assertNotSpam(input.website);

    // 2. validation
    validateInput(input);

    // 3. relations
    await assertParentValid(input.parentId, input.recipeId);

    // 4. rate limit
    await assertCooldown(input.fingerprint);

    // 5. auth
    const currentUser = await getUserFromCookies();
    const isAdmin = currentUser?.isAdmin ?? false;

    // 6. moderation
    await moderate(input.content);

    // 7. build entity
    const comment = buildComment(input, isAdmin);

    // 8. persist
    await writeClient.create(comment);

    return { comment };
}
export type ApiErrorResponse = {
    ok: false;
    error: {
        code: string;
        message: string;
    };
};
