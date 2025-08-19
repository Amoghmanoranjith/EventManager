import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/events
export async function GET() {
  try {
    const events = await prisma.events.findMany(); // table name from introspection
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
