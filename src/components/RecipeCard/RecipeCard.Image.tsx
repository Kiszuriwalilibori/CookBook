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
            sizes="(max-width: 599px) calc(100vw - 32px), (max-width: 899px) 330px, (max-width: 1223px) calc((100vw - 72px) / 2), 330px"
            style={{
                objectFit: "cover",
            }}
        />
    );
});
