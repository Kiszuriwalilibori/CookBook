import { JSX } from "react";
import PageTitle from "@/components/PageTitle";

export default function Favorites(): JSX.Element {
    return (
        <>
            <PageTitle title="Favorites" />
            <div className="container mx-auto p-4">
                <p className="text-lg">This is the favorites page. Your favorite items will be displayed here.</p>
            </div>
        </>
    );
}
