import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { genJWT } from "../../../../utils/genJWT";

// POST /api/signup
export async function POST(req: NextRequest) {
    try {
        const { name, email } = await req.json();
        // 1. Validate request body -------------------------
        if (!name || !email) {
            return NextResponse.json(
                { error: "Name and email are required" },
                { status: 400 } // 400 Bad Request → client did not send required fields
            );
        }
        // 2. Fetch user from database ----------------------
        const user = await prisma.users.create({
            data: {
                name: name,
                email: email
            }
        })
        // 3. Success response -----------------------------
        const token = genJWT(user);
        return NextResponse.json(
            { token },
            { status: 201 } // 200 OK → user successfully created
        );
    } catch (error : any) {
        // 4. Handle email violation
        if(error.code === "P2002"){
            return NextResponse.json(
                {error: "Given email is already registered"},
                {status: 409} // 409 Conflict -> given email is already registered
            )
        }
        // 5. Unexpected errors ---------------------------
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 } // 500 Internal Server Error → database or server failure
        );
    }
}
