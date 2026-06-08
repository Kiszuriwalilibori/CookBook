import { ImageResponse } from "next/og";

import { getRecipeById } from "@/utils/getRecipeById";
import { resolveRecipeIdFromSlug } from "@/utils/resolveRecipeIdFromSlug";

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const id = await resolveRecipeIdFromSlug(slug);

    if (!id) {
        return new ImageResponse(
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 64,
                    background: "#fff",
                }}
            >
                Nie znaleziono przepisu
            </div>,
            size
        );
    }

    const recipe = await getRecipeById(id);

    if (!recipe) {
        return new ImageResponse(
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 64,
                    background: "#fff",
                }}
            >
                Nie znaleziono przepisu
            </div>,
            size
        );
    }

    const imageUrl = recipe.description?.image?.asset?.url ?? recipe.preparationSteps?.[0]?.image?.asset?.url;

    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                position: "relative",
                overflow: "hidden",
                background: "#fff",
            }}
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt=""
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            ) : null}

            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.15))",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    left: 48,
                    right: 48,
                    bottom: 48,
                    display: "flex",
                    flexDirection: "column",
                    color: "#fff",
                }}
            >
                <div
                    style={{
                        fontSize: 64,
                        fontWeight: 700,
                        lineHeight: 1.1,
                    }}
                >
                    {recipe.title}
                </div>

                <div
                    style={{
                        marginTop: 16,
                        fontSize: 28,
                        opacity: 0.9,
                    }}
                >
                    Przepisy Piotra Maksymiuka
                </div>
            </div>
        </div>,
        size
    );
}
