import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "../../../../utils/verifyJWT";

// POST /api/rsvp
export async function POST(req: Request) {
    try {
        const { event_id, status } = await req.json();
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Extract token
        const token = authHeader.split(" ")[1];
        const user_id = verifyJWT(token).id; //get two errors one is 401 another 500

        // 1. Validate request body -------------------------
        // If any of the required fields are missing, the request is malformed.
        if(!user_id){
            return NextResponse.json(
                { error: "token might have expired" },
                { status: 400 } // 400 Bad Request → missing required parameters
            );
        }
        if (!event_id || !status) {
            return NextResponse.json(
                { error: "provide user_id, event_id and status" },
                { status: 400 } // 400 Bad Request → missing required parameters
            );
        }

        // Ensure status is one of the allowed values
        if (!["Yes", "No", "Maybe"].includes(status)) {
            return NextResponse.json(
                { error: "status must be one of: Yes, No, Maybe" },
                { status: 422 } // 422 Unprocessable Entity → syntactically valid but semantically invalid
            );
        }

        // 2. Create RSVP record ----------------------------
        const rsvp = await prisma.rsvps.create({
            data: { user_id, event_id, status },
        });

        // If create succeeds, Prisma always returns a record.

        return NextResponse.json(
            { message: "record created successfully" },
            { status: 201 } // 201 Created → new resource successfully created
        );

    } catch (error: any) {
        console.error(error);

        // 3. Prisma-specific error handling ----------------
        if (error.code === "P2002") {
            // Unique constraint violation (duplicate entry)
            return NextResponse.json(
                { error: "RSVP already exists for this user & event" },
                { status: 409 } // 409 Conflict → resource already exists
            );
        }
        else if (error.code === "P2003") {
            // Foreign key constraint violation (invalid user_id or event_id)
            if (error.meta?.constraint === "rsvps_user_id_fkey") {
                return NextResponse.json(
                    { error: "user with the given id not found" },
                    { status: 404 } // 404 Not Found → related user missing
                );
            } else if (error.meta?.constraint === "rsvps_event_id_fkey") {
                return NextResponse.json(
                    { error: "event with the given id not found" },
                    { status: 404 } // 404 Not Found → related event missing
                );
            } else {
                return NextResponse.json(
                    { error: "bad request" },
                    { status: 400 } // 400 Bad Request → generic fallback
                );
            }
        }

        // 4. Unexpected errors -----------------------------
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 } // 500 Internal Server Error → unexpected failure
        );
    }
}
