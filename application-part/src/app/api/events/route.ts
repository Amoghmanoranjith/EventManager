import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import client from "@/lib/redis";
// GET /api/events
// Query parameters (all optional):
// - pagination: true/false → whether to enable pagination
// - page: int → page number (1-based index)
// - size: int → number of records per page
export async function GET(req: Request) {
  try {
    // 1. Parse query params from URL -----------------------
    const { searchParams } = new URL(req.url);

    const pagination = searchParams.get("pagination") === "true"; // default = false
    const page = parseInt(searchParams.get("page") || "1", 10);   // default = 1
    const size = parseInt(searchParams.get("size") || "10", 10);  // default = 10


    // 3. Handle pagination logic --------------------------
    if (pagination) {
      // 3a. Validate `page` and `size` 
      if (page < 1) {
        return NextResponse.json(
          { error: "Page number must be >= 1" },
          { status: 400 }
        );
      }
      if (size < 1 || size > 100) {
        return NextResponse.json(
          { error: "Page size must be between 1 and 100" },
          { status: 400 }
        );
      }

      // redis happens
      // if get_events is empty hit the db once with this and 

      // 3b. Count total records
      const totalRecords = await prisma.events.count();

      // 3c. Calculate total pages
      const totalPages = Math.ceil(totalRecords / size);

      // 3d. Validate page within bounds
      if (page > totalPages && totalRecords > 0) {
        return NextResponse.json(
          { error: `Page ${page} is out of range. Max page = ${totalPages}` },
          { status: 400 }
        );
      }

      // 3e. Fetch paginated events
      const events = await prisma.events.findMany({
        skip: (page - 1) * size,
        take: size,
        orderBy: { date: "desc" },
      });

      // 3f. Build pagination metadata
      const paginationInfo = {
        total_records: totalRecords,
        current_page: page,
        total_pages: totalPages,
        next_page: page < totalPages ? page + 1 : null,
        prev_page: page > 1 ? page - 1 : null,
        page_size: size,
      };

      // 3g. Return paginated response
      return NextResponse.json(
        { data: events, pagination: paginationInfo },
        { status: 200 }
      );
    }

    // 4. If no pagination requested → return all events ----
    // redis happens here
    console.time('redis_get');
    const cachedEvents = await client.get('all_events');
    console.timeEnd('redis_get');
    if (cachedEvents) {
      const eventsString = typeof cachedEvents === 'string'
        ? cachedEvents
        : cachedEvents.toString();

      const events = JSON.parse(eventsString);
      return NextResponse.json({ data: events }, { status: 200 });
    }
    // meaning not found
    console.time('db query');
    const events = await prisma.events.findMany({
      orderBy: { date: 'asc' },
    });
    console.timeEnd('db query');
    await client.set('all_events', JSON.stringify(events));

    return NextResponse.json({ data: events }, { status: 200 });
  } catch (error) {
    // 5. Unexpected error handling -------------------------
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
