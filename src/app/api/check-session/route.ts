// import { NextResponse } from "next/server";
// import { OAuth2Client } from "google-auth-library";

// const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

// export async function POST(req: Request) {
//     try {
//         const { idToken } = await req.json();

//         if (!idToken) {
//             return NextResponse.json({ isMySession: false }, { status: 400 });
//         }

//         // Verify the ID token using Google public keys
//         const ticket = await client.verifyIdToken({
//             idToken,
//             audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//         });
//         const payload = ticket.getPayload();
//         const email = payload?.email?.toLowerCase();
//         const myEmail = process.env.MY_EMAIL?.toLowerCase();

//         const isMySession = email === myEmail;
//         return NextResponse.json({ isMySession });
//     } catch (err) {
//         console.error("Token verification failed:", err);
//         return NextResponse.json({ isMySession: false }, { status: 401 });
//     }
// }

import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
    try {
        const { idToken } = await req.json();

        if (!idToken) {
            return NextResponse.json({ isAdminLogged: false }, { status: 400 });
        }

        // Verify the ID token using Google public keys
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload?.email?.toLowerCase();
        const myEmail = process.env.MY_EMAIL?.toLowerCase();

        // Optional: Validate MY_EMAIL exists
        if (!myEmail) {
            console.error("Missing MY_EMAIL env var");
            return NextResponse.json({ isAdminLogged: false }, { status: 500 });
        }

        const isAdminLogged = email === myEmail;
        return NextResponse.json({ isAdminLogged });
    } catch (err) {
        console.error("Token verification failed:", err);
        return NextResponse.json({ isAdminLogged: false }, { status: 401 });
    }
}
