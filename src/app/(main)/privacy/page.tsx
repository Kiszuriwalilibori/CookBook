import pageMetadataConfig from "../../../../public/metadata/metadata";

export const metadata = pageMetadataConfig.privacy || {
    title: "Polityka prywatności – Książka Kucharska Piotra",
    description: "Informacje o polityce prywatności w serwisie Książka Kucharska Piotra.",
};

export default function PrivacyPage() {
    return (
        <div>
            <h1>Polityka prywatności</h1>
            <p>Treść polityki prywatności Twojej strony...</p>
        </div>
    );
}
