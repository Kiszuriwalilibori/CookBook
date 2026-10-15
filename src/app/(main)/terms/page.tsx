import pageMetadataConfig from "../../../../public/metadata/metadata";

export const metadata = pageMetadataConfig.terms || {
    title: "Regulamin – Książka Kucharska Piotra",
    description: "Regulamin korzystania z serwisu Książka Kucharska Piotra.",
};

export default function TermsPage() {
    return (
        <div>
            <h1>Regulamin</h1>
            <p>Treść regulaminu Twojej strony...</p>
        </div>
    );
}
