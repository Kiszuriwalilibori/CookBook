import { Pages } from "@/models/pages";
import type { Metadata } from "next";

const AUTHOR_URL = "https://portfolio-next-ten-sigma.vercel.app/";
const BASE_URL = "https://cook-book-inky.vercel.app/";
const DEFAULT_KEYWORDS = [
    "przepisy kulinarne",
    "przepisy na obiad",
    "łatwe przepisy",
    "przepisy na ciasto",
    "blog kulinarny",
    "przepisy na deser",
    "zdrowe przepisy",
    "przepisy wegańskie",
    "przepisy na śniadanie",
    "przepisy na kolację",
    "proste przepisy",
    "przepisy na zupę",
    "przepisy na sałatkę",
    "przepisy na ciasteczka",
    "przepisy na kurczaka",
    "przepisy na pierogi",
    "przepisy na naleśniki",
    "przepisy na pizzę",
    "przepisy na tort",
    "przepisy na święta",
    "przepisy na grill",
    "przepisy bezglutenowe",
    "przepisy fit",
    "przepisy dla dzieci",
    "przepisy na Thermomix",
    "jak zrobić",
    "pomysły na obiad",
    "szybkie przepisy",
    "tradycyjne przepisy polskie",
    "przepisy na Boże Narodzenie",
    "gotowanie",
    "łatwe gotowanie",
    "jak gotować",
    "co ugotować na obiad",
    "pomysły na gotowanie",
    "kuchnia polska",
    "domowe gotowanie",
    "co na obiad",
    "inspiracje kulinarne",
    "gotuj z nami",
    "porady kulinarne",
];
const DEFAULT_ROBOTS = {
    index: true,
    follow: true,
    googleBot: {
        index: true,
        follow: true,
    },
};
const DEFAULT_AUTHORS = [{ name: "Piotr Maksymiuk", url: AUTHOR_URL }];
const DEFAULT_OG = {
    siteName: "Przepisy Piotra Maksymiuka",
    type: "website",
    locale: "pl_PL",
    description: "Proste i pyszne przepisy na każdy dzień. Obiady, desery, przekąski i więcej – wszystko przetestowane w domowej kuchni.",
    images: [
        {
            // url: "https://twoja-domena.pl/og-image-default.jpg", // 1200x630 px rekomendowane
            url: `${BASE_URL}og-image-default.jpg`,
            width: 1200,
            height: 630,
            alt: "Książka Kucharska Piotra – domowe przepisy kulinarne",
        },
    ],
};

const DEFAULT_ICONS: Metadata["icons"] = {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" }, { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }],
    apple: "/apple-touch-icon.png",
};

const createPageMetadata = (
    page: Pages,
    pageSpecific: {
        title: string;
        description: string;
        keywords?: string[];
        icons?: Metadata["icons"];
        openGraph?: Partial<Metadata["openGraph"]>;
    }
): Metadata => ({
    title: pageSpecific.title,
    description: pageSpecific.description,
    keywords: [...DEFAULT_KEYWORDS, ...(pageSpecific.keywords || [page])],
    alternates: {
        canonical: page === "home" ? BASE_URL : `${BASE_URL}/${page}`,
    },
    openGraph: {
        ...DEFAULT_OG,
        title: pageSpecific.title,
        description: pageSpecific.description,
        url: page === "home" ? BASE_URL : `${BASE_URL}/${page}`,
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
    icons: pageSpecific.icons ?? DEFAULT_ICONS,
});

export const metadata: {
    [key in Pages]: Metadata;
} = {
    home: createPageMetadata("home", {
        title: "Książka Kucharska Piotra – Sprawdzone przepisy domowe",
        description: "Proste i pyszne przepisy na każdy dzień. Obiady, desery, przekąski i więcej – wszystko przetestowane w domowej kuchni.",
        keywords: ["przepisy kulinarne", "książka kucharska", "gotowanie"],
    }),
    about: createPageMetadata("about", {
        title: "O mnie – Książka Kucharska Piotra",
        description: "Poznaj autora bloga kulinarnego i książki kucharskiej. Pasja do gotowania, sprawdzone przepisy i kulinarne inspiracje.",
        keywords: ["o mnie", "autor bloga kulinarnego", "Piotr Maksymiuk"],
    }),

    blog: createPageMetadata("blog", {
        title: "Blog kulinarny – Książka Kucharska Piotra",
        description: "Artykuły, porady i historie kulinarne. Nowe wpisy o gotowaniu, składnikach, technikach i sezonowych inspiracjach.",
        keywords: ["blog kulinarny", "wpisy kulinarne", "porady kuchenne"],
    }),

    favorites: createPageMetadata("favorites", {
        title: "Ulubione przepisy – Książka Kucharska Piotra",
        description: "Moje najbardziej lubiane i najczęściej przygotowywane przepisy. Klasyki domowej kuchni w jednym miejscu.",
        keywords: ["ulubione przepisy", "najlepsze przepisy", "przepisy domowe"],
    }),
    contact: createPageMetadata("contact", {
        title: "Kontakt z autorem Książki Kucharskiej Piotra",
        description: "O tym, jak się ze mną skontaktować i jak tego nie robić",
        keywords: ["kontakt", "kontakt z autorem", "kontakt z autorem Książki Kucharskiej Piotra"],
    }),
    privacy: createPageMetadata("privacy", {
        title: "Zasady prywatności Książki Kucharskiej Piotra",
        description: "Zasady prywatności",
        keywords: ["zasady prywatności", "polityka prywatności", "zasady prywatności Książki Kucharskiej Piotra"],
    }),
    terms: createPageMetadata("terms", { title: "Regulamin Książki Kucharskiej Piotra", description: "Regulamin Książki Kucharskiej Piotra", keywords: ["regulamin", "regulamin Książki Kucharskiej Piotra", "regulamin Książki Kucharskiej Piotra"] }),

    recipes: createPageMetadata("recipes", {
        title: "Przepisy kulinarne – Książka Kucharska Piotra",
        description: "Setki sprawdzonych przepisów na obiady, desery, przekąski i więcej. Proste, pyszne i domowe dania na każdą okazję.",
        keywords: ["wszystkie przepisy", "kategoria przepisów", "przepisy na każdy dzień"],
    }),
};

export default metadata;
