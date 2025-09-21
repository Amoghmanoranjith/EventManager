import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import client from "@/lib/redis"; // Valkey client

// GET /api/events
// Query parameters (all optional):
// - pagination: true/false → enable pagination
// - page: int → page number (1-based index, default = 1)
// - size: int → number of records per page (default = 10)
export async function GET(req: Request) {
  try {
    // 1. Parse query params from URL -----------------------
    const { searchParams } = new URL(req.url);

    const pagination = searchParams.get("pagination") === "true";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);

    // 2. If pagination is requested -----------------------
    if (pagination) {
      // 2a. Try Valkey first (fetch all_events from cache)
      const cachedEvents = await client.get("all_events");
      let allEvents: any[];

      if (cachedEvents) {
        // Found in Valkey → parse JSON
        allEvents =
          typeof cachedEvents === "string"
            ? JSON.parse(cachedEvents)
            : JSON.parse(cachedEvents.toString());
      } else {
        // Cache miss → hit DB once
        allEvents = await prisma.events.findMany({
          orderBy: { date: "desc" },
        });

        // Store result in Valkey with 20s TTL
        await client.set("all_events", JSON.stringify(allEvents), {
          EX: 20,
        });
      }

      // 2b. Pagination calculations -----------------------
      const totalRecords = allEvents.length;
      const totalPages = Math.ceil(totalRecords / size);

      if (page > totalPages && totalRecords > 0) {
        return NextResponse.json(
          { error: `Page ${page} is out of range. Max page = ${totalPages}` },
          { status: 400 }
        );
      }

      // 2c. Slice cached events for current page ----------
      const startIdx = (page - 1) * size;
      const paginatedEvents = allEvents.slice(startIdx, startIdx + size);

      // 2d. Build pagination metadata ---------------------
      const paginationInfo = {
        total_records: totalRecords,
        current_page: page,
        total_pages: totalPages,
        next_page: page < totalPages ? page + 1 : null,
        prev_page: page > 1 ? page - 1 : null,
        page_size: size,
      };

      // 2e. Return paginated response ---------------------
      return NextResponse.json(
        { data: paginatedEvents, pagination: paginationInfo },
        { status: 200 }
      );
    }

    // 3. If no pagination requested -----------------------
    // 3a. Try Valkey for all_events -----------------------
    const cachedEvents = await client.get("all_events");
    if (cachedEvents) {
      const events =
        typeof cachedEvents === "string"
          ? JSON.parse(cachedEvents)
          : JSON.parse(cachedEvents.toString());
      return NextResponse.json({ data: events }, { status: 200 });
    }

    // 3b. Cache miss → query DB --------------------------
    const events = await prisma.events.findMany({
      orderBy: { date: "asc" },
    });

    // Store result in Valkey with 20s TTL
    await client.set("all_events", JSON.stringify(events), {
      EX: 20,
    });

    // 3c. Return non-paginated response ------------------
    return NextResponse.json({ data: events }, { status: 200 });
  } catch (error) {
    // 4. Unexpected error handling ------------------------
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
