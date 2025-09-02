import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "../../../../../utils/verifyJWT";
import { z } from "zod"

// defining the schema we expect from the user
const EventSchema = z.object({
    title: z.string().max(200, "Title must be at most 200 characters"),
    description: z.string().max(1500, "Description must be at most 1500 characters"),
    date: z.coerce.date(), // ensures string/number inputs are converted to Date
    city: z.string().max(100, "City must be at most 100 characters"),
});


// POST /api/events/create
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const token = authHeader.split(" ")[1];
        // get the user id stored in jwt
        const created_by = verifyJWT(token).decoded.id; //get two errors one is 401 another 500
        
        // 1. Validate request body -------------------------
        const parseResult = EventSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json(
                { error: JSON.parse(parseResult.error.message) },
                { status: 400 }
            );
        }
        // If created_by is null return token expiration message
        if (!created_by) {
            return NextResponse.json(
                { error: "token might have expired" },
                { status: 400 } // 400 Bad Request → missing required parameters
            );
        }
        const { title, description, date, city } = parseResult.data;
        // 2. Create a new event ---------------------------------
        const event = await prisma.events.create({
            data: {
                title,
                description,
                date,
                city,
                created_by
            },
        });
        return NextResponse.json(
            { message: "event successfully created" },
            { status: 201 } // 201 Created successfully
        )

    } catch (error) {
        console.log(error);
        // 3. JWT errors --------------------------------------
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
        // 4. Unexpected errors -----------------------------
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 } // 500 Internal Server Error → unexpected failure
        );
    }

}