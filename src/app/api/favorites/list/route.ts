import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyGoogle } from "../../../../lib/googleAuth";
import { client } from "../../../../utils/client";

export async function GET(req: NextRequest) {
    try {
        const user = await verifyGoogle(req);

        const favorites = await client.fetch(
            `*[_type=="favorite" && userId==$userId]{
        recipe->{
          _id,
          title,
          slug
        }
      } | order(createdAt desc)`,
            { userId: user.userId }
        );

        return NextResponse.json(favorites);
    } catch {
        return NextResponse.json([], { status: 401 });
    }
}
