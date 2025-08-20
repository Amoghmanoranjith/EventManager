import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/events/{id}
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
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
