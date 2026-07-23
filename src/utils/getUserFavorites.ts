import { writeClient } from "@/utils/writeClient";
export async function getUserFavorites(userId: string): Promise<string[]> {
    if (!userId) return [];

    return writeClient.fetch(`*[_type == "favorite" && userId == $userId].recipe._ref`, { userId });
}
