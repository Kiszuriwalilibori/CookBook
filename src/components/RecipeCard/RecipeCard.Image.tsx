import React from "react";

import Image from "next/image";

interface RecipeCardImageProps {
    imageUrl: string;
    title: string;
}

export const RecipeCardImage = React.memo(function RecipeCardImage({ imageUrl, title }: RecipeCardImageProps) {
    return (
        <Image
            src={imageUrl}
            alt={title ? `${title} - zdjęcie przepisu` : "Zdjęcie przepisu"}
            fill
            sizes="(max-width: 600px) 100vw, 300px"
            style={{
                objectFit: "cover",
            }}
        />
    );
});
