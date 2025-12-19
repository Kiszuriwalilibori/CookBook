import { Pages } from "@/models/pages";
import type { Metadata } from "next";


const BASE_URL = "https://portfolio-next-15.vercel.app";
const DEFAULT_KEYWORDS = ["portfolio", "developer", "react", "next.js"];
const DEFAULT_ROBOTS = {
    index: true,
    follow: true,
    googleBot: {
        index: true,
        follow: true,
    },
};
const DEFAULT_AUTHORS = [{ name: "Piotr Maksymiuk", url: BASE_URL }];
const DEFAULT_OG = {
    siteName: "Piotr Maksymiuk's Portfolio",
    type: "website",
    locale: "en_US",
};

const createPageMetadata = (
    page: Pages,
    pageSpecific: {
        title: string;
        description: string;
        keywords?: string[];
        openGraph?: Partial<Metadata["openGraph"]>;
    }
): Metadata => ({
    title: pageSpecific.title,
    description: pageSpecific.description,
    keywords: [...DEFAULT_KEYWORDS, ...(pageSpecific.keywords || [page])],
    alternates: {
        canonical: `${BASE_URL}/${page === "about" ? "" : page}`,
    },
    openGraph: {
        ...DEFAULT_OG,
        title: pageSpecific.title,
        description: pageSpecific.description,
        url: `${BASE_URL}/${page === "about" ? "" : page}`,
        ...pageSpecific.openGraph,
    },
    twitter: {
        card: "summary_large_image",
        title: pageSpecific.title,
        description: pageSpecific.description,
        creator: "@Kiszuriwalilib1",
    },
    robots: DEFAULT_ROBOTS,
    authors: DEFAULT_AUTHORS,
});

export const metadata: {
    [key in Pages]: Metadata;
} = {
    about: createPageMetadata("about", {
        title: "About me",
        description: "Basic informations about author, the details are covered on the other pages.",
    }),
    skills: createPageMetadata("skills", {
        title: "Skills",
        description: "Acquired skills, gained certificates, graduated schools, completed trainings and other educational events",
        keywords: ["skills"],
    }),
    career: createPageMetadata("career", {
        title: "Career",
        description: "The abbreviated history of employment, with short characteristic of job and tasks.",
        keywords: ["career", "work experience"],
        openGraph: {
            description: "The abbreviated history of employment, with short characteristic of job and tasks.", // Override empty description
        },
    }),
    projects: createPageMetadata("projects", {
        title: "Projects",
        description: "The list and brief descriptions of projects I have completed and working on currently.",
        keywords: ["projects", "work experience"],
    }),
    contact: createPageMetadata("contact", {
        title: "Contact",
        description: "My contact details. Currently, I am available for hire and open to any ideas of cooperation.",
        keywords: ["contact", "hire"],
    }),
};

export default metadata;


// todo do całkowitego przerobu