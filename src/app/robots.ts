// src/app/robots.ts

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: "https://cook-book-inky.vercel.app/sitemap.xml",
    };
}
