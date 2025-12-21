import metadata from "../../../../public/metadata/metadata";

export const pageMetadata = metadata.contact || {
    title: "Kontakt – Książka Kucharska Piotra",
    description: "Formularz kontaktowy i dane kontaktowe autora bloga kulinarnego.",
};

export default function ContactPage() {
    return (
        <div>
            <h1>Kontakt</h1>
            <p>Tu możesz dodać formularz kontaktowy lub dane kontaktowe...</p>
        </div>
    );
}
