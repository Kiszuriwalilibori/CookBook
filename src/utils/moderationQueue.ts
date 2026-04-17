// utils/moderationQueue.ts
import { writeClient } from "@/utils";
import { analyzeComment } from "@/utils/perspective";

type Job = {
    id: string;
    content: string;
};

const queue: Job[] = [];

// 🔥 enqueue
export function queueModeration(id: string, content: string) {
    console.log(`[MODERATION] queued comment: ${id}`);

    queue.push({ id, content });
}

// 🔥 worker
setInterval(async () => {
    if (queue.length === 0) return;

    console.log(`[MODERATION] processing batch size: ${queue.length}`);

    const batch = queue.splice(0, 10);

    await Promise.all(batch.map(job => moderate(job)));
}, 1000);

async function moderate(job: Job) {
    try {
        const result = await analyzeComment(job.content);

        console.log(`[MODERATION] ${job.id} → ${result.valid ? "APPROVED" : "REJECTED"} (score=${result.score.toFixed(2)})`);

        await writeClient
            .patch(job.id)
            .set({
                status: result.valid ? "approved" : "rejected",
                moderationScore: result.score,
                moderationReason: result.valid ? null : "TOXICITY_THRESHOLD",
            })
            .commit();
    } catch (e) {
        console.log(`[MODERATION] ${job.id} → ERROR (forced reject) ${e}`);

        await writeClient
            .patch(job.id)
            .set({
                status: "rejected",
                moderationReason: "MODERATION_ERROR",
            })
            .commit();
    }
}
