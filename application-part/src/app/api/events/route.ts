import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/events
export async function GET() {
  try {
    // 1. Fetch all events from the database ----------------
    const events = await prisma.events.findMany(); // returns [] if no records

    // 2. Return the events -------------------------------
    return NextResponse.json(events, { status: 200 }); // 200 OK → success
  } catch (error) {
    // 3. Unexpected error handling -----------------------
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 } // 500 Internal Server Error → DB or server failure
    );
  }
}
