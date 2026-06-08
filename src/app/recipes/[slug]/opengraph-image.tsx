import { ImageResponse } from "next/og";

import { getRecipeById } from "@/utils/getRecipeById";
import { resolveRecipeIdFromSlug } from "@/utils/resolveRecipeIdFromSlug";

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
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                position: "relative",
                fontFamily: "system-ui, -apple-system, sans-serif",
                overflow: "hidden",
            }}
        >
            {/* OSTRE zdjęcie w tle - JAŚNIEJSZE */}
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt=""
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "brightness(0.78)", // ← mniej przyciemnione
                    }}
                />
            ) : (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(135deg, #1f2937, #0f172a)",
                    }}
                />
            )}

            {/* Lżejsze przyciemnienie */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.08), rgba(0,0,0,0.65))",
                }}
            />

            {/* Glass Panel - mocniejszy efekt szklany */}
            <div
                style={{
                    position: "absolute",
                    left: 64,
                    right: 64,
                    bottom: 64,
                    background: "rgba(15, 23, 42, 0.85)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderRadius: 24,
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    padding: "32px 40px",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        fontSize: 58,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        // color: "#000",
                        color: "#ffffff",
                        marginBottom: 20,
                    }}
                >
                    {recipe.title}
                </div>

                <div style={{ display: "flex", gap: 16 }}>
                    <div
                        style={{
                            background: "rgba(255,255,255,0.25)",
                            padding: "8px 24px",
                            borderRadius: 9999,
                            fontSize: 26,
                            fontWeight: 600,
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        ⏱ {time} min
                    </div>
                    <div
                        style={{
                            background: "rgba(255,255,255,0.25)",
                            padding: "8px 24px",
                            borderRadius: 9999,
                            fontSize: 26,
                            fontWeight: 600,
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        🔥 {calories} kcal
                    </div>
                </div>
            </div>

            {/* Branding */}
            <div
                style={{
                    position: "absolute",
                    top: 48,
                    right: 48,
                    background: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    padding: "12px 28px",
                    borderRadius: 9999,
                    fontSize: 26,
                    fontWeight: 700,
                    backdropFilter: "blur(12px)",
                }}
            >
                Piotr Maksymiuk
            </div>
        </div>,
        size
    );
}
