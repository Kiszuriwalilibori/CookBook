import pageMetadataConfig from "../../../../public/metadata/metadata";
import GoogleLogoutButton from "./GoogleLogoutButton";
import GoogleSignInButton from "./GoogleSignInButton";

export const metadata = pageMetadataConfig.privacy || {
    title: "Polityka prywatności – Książka Kucharska Piotra",
    description: "Informacje o polityce prywatności w serwisie Książka Kucharska Piotra.",
};

export default function Admin() {
    return (
        <div>
            <GoogleSignInButton />
            <GoogleLogoutButton />
        </div>
    );
}
