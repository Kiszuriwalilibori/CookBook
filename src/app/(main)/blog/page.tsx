import { JSX } from "react";
import PageTitle from "@/components/PageTitle";

export default function Blog(): JSX.Element {
    return (
        <>
            <PageTitle title="Blog" />
            <div className="container mx-auto p-4">
                <p className="text-lg">
                    This is the blog page. Content will go here.
                </p>
            </div>
        </>
    );
}
