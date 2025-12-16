// import OpenAI from "openai";

// const client = new OpenAI({
//     apiKey: process.env.TRANSLATION_KEY,
// });

// export async function translateToEnglish(polishText: string, maxRetries = 3): Promise<string> {
//     console.log("Starting translation:", polishText);
//     console.log("process.env.TRANSLATION_KEY", process.env.TRANSLATION_KEY);
//     for (let attempt = 1; attempt <= maxRetries; attempt++) {
//         try {
//             console.log(`[Attempt ${attempt}] Sending request to OpenAI API`);
//             const response = await client.chat.completions.create({
//                 model: "gpt-3.5-turbo",
//                 messages: [
//                     { role: "system", content: "You are a translator. Translate Polish text to English, preserving meaning accurately." },
//                     { role: "user", content: polishText },
//                 ],
//             });

//             // const response = await client.chat.completions.create({
//             //     model: "gpt-4",
//             //     messages: [
//             //         { role: "system", content: "You are a translator. Translate Polish text to English, preserving meaning accurately." },
//             //         { role: "user", content: polishText },
//             //     ],
//             //     temperature: 0, // deterministic translation
//             // });

//             const translated = response.choices?.[0]?.message?.content?.trim();

//             if (translated) {
//                 console.log(`[Attempt ${attempt}] Translation result:`, translated);
//                 return translated;
//             } else {
//                 console.warn(`[Attempt ${attempt}] No content returned from GPT API`);
//             }
//         } catch (err) {
//             console.error(`[Attempt ${attempt}] Translation failed:`, err);
//         }

//         if (attempt < maxRetries) {
//             console.log(`[Attempt ${attempt}] Retrying...`);
//             await new Promise(res => setTimeout(res, 500 * attempt)); // exponential backoff
//         }
//     }

//     console.warn("All attempts failed, returning original text");
//     return polishText; // fallback
// }
// export default translateToEnglish;
