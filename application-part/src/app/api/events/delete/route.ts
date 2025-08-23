import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "../../../../../utils/verifyJWT";
// only the creator can delete the event
// in the query use user_id in jwt and event_id

// DELETE /api/events/delete
export async function POST(req: NextRequest) {
    try {
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json(
                { error: "event id is required" },
                { status: 400 } // 400 Bad Request client did not send required fields
            );
        }
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // 401 bad auth → missing headers
        }
        const token = authHeader.split(" ")[1];
        const created_by = verifyJWT(token).decoded.id; //get two errors one is 401 another 500
        // no need for zod parsing as we have only one id to verify
        if (!created_by) { // If created_by is null return token expiration message
            return NextResponse.json(
                { error: "token might have expired" },
                { status: 400 } // 400 Bad Request missing required parameters
            );
        }
        const result = await prisma.events.deleteMany({
            where: {
                id,           // primary key
                created_by,   // admin security
            },
        });

        console.log(result);
        if (result.count) {
            return NextResponse.json(
                { message: "event successfully deleted" },
                { status: 200 } // 200 deleted successfully
            )
        }
        else{
            // handle db error if not found
            return NextResponse.json(
                { message: "you are not authorized to do that" },
                { status: 401 } // 401 not authorized
            )

        }
    } catch (error) {
        console.log(error);
        // 4. JWT errors --------------------------------------
        if (error.code === "jwt_secret_not_found") {
            return NextResponse.json(
                { error: error.message },
                { status: 500 } // 500 secret key not found
            );
        }
        else if (error.code === "invalid_jwt") {
            return NextResponse.json(
                { error: error.message },
                { status: 401 } // 401 jwt is valid
            );
        }
        // 5. Unexpected errors -----------------------------
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 } // 500 Internal Server Error unexpected failure
        );
    }
}
