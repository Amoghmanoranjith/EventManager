import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { genJWT } from "../../../../utils/genJWT";
import type { NextRequest } from "next/server";

// POST /api/login
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
    // AND condition ensures both email and name match
    const user = await prisma.users.findFirst({
      where: {
        AND: [
          { email },     // email is unique
          { name },      // extra low-level auth check
        ],
      },
    });

    // 3. Handle user not found ------------------------
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 } // 404 Not Found → no matching user
      );
    }
    // 4. Success response -----------------------------
    // generate a jwt token using the user
    const token = genJWT(user);
    return NextResponse.json(
      { token},
      { status: 200 } // 200 OK → user successfully found
    );
  } catch (error) {
    // 5. Unexpected errors ---------------------------
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 } // 500 Internal Server Error → database or server failure
    );
  }
}
