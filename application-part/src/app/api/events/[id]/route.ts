import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";


// GET /api/events/{id}
export async function GET(req: NextRequest, { params }: {params: Promise<{ id: string }>}) {
  try {
    const { id } = await params;
    
    const event = await prisma.events.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 } // 404 Not Found → no event with this ID
      );
    }

    return NextResponse.json(event, { status: 200 }); // 200 OK → found
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 } // 500 Internal Server Error → DB or server failure
    );
  }
}
// i also want to return the count of rsvps to an event i can do this in 3 ways:
// 1. a separate rsvps_count table
// + clean tables 
// + 
// 2. create a column in events which will hold the count of rsvps to that event
// 3. count the number of rows in rsvps table where event_id is given event_id

