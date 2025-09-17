import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { error } from "console";

// GET /api/rsvp_counts
export async function GET(req: NextRequest, { params }: {params: Promise<{ id: string }>}) {
  try {
    // 1. get the event id----------------
    const { id } = await params;    // 2. Return the events -------------------------------
    const rsvp_counts = await prisma.rsvp_counts.findUnique({
      where: {event_id:id}
    });
    if(!rsvp_counts){
      return NextResponse.json(
        {error: "Invalid event id"},
        { status: 404 } // 404 Not Found → no event with this ID
      );
    }

    return NextResponse.json(rsvp_counts, { status: 200 }); // 200 OK → found
  } catch (error) {
    // 3. Unexpected error handling -----------------------
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch rsvp counts" },
      { status: 500 } // 500 Internal Server Error → DB or server failure
    );
  }
}
