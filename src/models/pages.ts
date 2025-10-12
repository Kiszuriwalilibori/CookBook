export const PAGES = ["about", "skills", "projects", "career", "contact"] as const;
export type Pages = (typeof PAGES)[number];

export abstract class PageUtils {
    static pageToHref(page: Pages): string {
        return `/${page}`;
    }

    static pageToIconSrc(page: Pages): string {
        return `/icons/${page}.svg`;
    }

    static pageToImgAlt(page: Pages): string {
        return `${page} link`;
    }

    static pageToKey(ID: string, page: Pages): string {
        return `${ID}-${page}`;
    }
    static projectPage(title: string) {
        return `/projects/${title}`;
    }
}
