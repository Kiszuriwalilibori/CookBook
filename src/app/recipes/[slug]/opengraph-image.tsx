import { ImageResponse } from "next/og";

import { getRecipeById } from "@/utils/getRecipeById";
import { resolveRecipeIdFromSlug } from "@/utils/resolveRecipeIdFromSlug";
import { styles } from "./opengraph-image.styles";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const id = await resolveRecipeIdFromSlug(slug);
    const recipe = id ? await getRecipeById(id) : null;

    if (!recipe) {
        return new ImageResponse(
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
                    color: "#fff",
                    fontFamily: "system-ui, sans-serif",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 80, fontWeight: 700 }}>Przepisy</div>
                    <div style={{ fontSize: 48, marginTop: 16, opacity: 0.8 }}>Piotra Maksymiuka</div>
                </div>
            </div>,
            size
        );
    }

    const imageUrl = recipe.description?.image?.asset?.url ?? recipe.preparationSteps?.[0]?.image?.asset?.url;

    const time = recipe.prepTime || recipe.cookTime || "30";
    const calories = recipe.calories || "450";

    return new ImageResponse(
        <div style={styles.root}>
            {imageUrl ? <img src={imageUrl} alt="" style={styles.backgroundImage} /> : <div style={styles.backgroundFallback} />}
            <div style={styles.overlay} />

            {/* Glass Panel - mocniejszy efekt szklany */}
            <div style={styles.glassPanel}>
                <div style={styles.title}>{recipe.title}</div>

                <div style={styles.badgesWrapper}>
                    <div style={styles.badge}>⏱ {time} min</div>
                    <div style={styles.badge}>🔥 {calories} kcal</div>
                </div>
            </div>

            <div style={styles.branding}>Piotr Maksymiuk</div>
        </div>,
        size
    );
}
