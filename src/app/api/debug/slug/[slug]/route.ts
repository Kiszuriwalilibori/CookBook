// import { NextResponse } from "next/server";
// import { groq } from "next-sanity";
// import { client } from "@/utils/client";

// export async function GET(req: Request, { params }: { params: { slug: string } }) {
//     const { slug } = await params;

//     const data = await client.fetch(
//         groq`
//       *[
//         _type == "recipe" &&
//         ($slug == slug.current || $slug in slug.history)
//       ]{
//         _id,
//         title,
//         "current": slug.current,
//         "history": slug.history,
//         _updatedAt
//       }
//     `,
//         { slug }
//     );

//     return NextResponse.json(data);
// }

import { NextResponse } from "next/server";
import { groq } from "next-sanity";
import { client } from "@/utils/client";

export async function GET(req: Request, context: { params: Promise<{ slug: string }> }) {
    const params = await context.params;
    const { slug } = params;

    const data = await client.fetch(
        groq`
      *[
        _type == "recipe" &&
        ($slug == slug.current || $slug in slug.history)
      ]{
        _id,
        title,
        "current": slug.current,
        "history": slug.history,
        _updatedAt
      }
    `,
        { slug }
    );

    return NextResponse.json(data);
}
