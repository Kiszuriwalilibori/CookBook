// // utils/perspective.ts

const API_URL = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`;

const CONFIG = {
    languages: ["en"],
    requestedAttributes: {
        TOXICITY: {},
        INSULT: {},
        THREAT: {},
    },
};

export async function analyzeComment(text: string) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            comment: { text },
            ...CONFIG,
        }),
    });

    if (!res.ok) {
        throw new Error(`Perspective API error: ${res.status}`);
    }

    const data = await res.json();

    const scores = data.attributeScores ?? {};

    const toxicity = scores.TOXICITY?.summaryScore?.value ?? 0;
    const insult = scores.INSULT?.summaryScore?.value ?? 0;
    const threat = scores.THREAT?.summaryScore?.value ?? 0;

    const maxScore = Math.max(toxicity, insult, threat);

    return {
        valid: maxScore < 0.75,
        score: maxScore,
        raw: scores,
    };
}
