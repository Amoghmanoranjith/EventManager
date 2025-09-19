// prisma/seedEvents.ts
import { prisma } from "@/lib/prisma";

// User ID that exists in your DB (adjust if needed)
const CREATED_BY = "01409f1c-0fc4-42bc-96bd-f5815aab78ae";

// Example city list
const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad"];

async function resetEvents() {
  console.log("🔄 Truncating events (cascade)...");
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "events" CASCADE;`);
  console.log("✅ Events table truncated.");
}

async function createEvents(count: number) {
  console.log(`Creating ${count} events...`);
  const start = Date.now();

  const batchSize = 1000;
  for (let i = 0; i < count; i += batchSize) {
    const batch = Array.from(
      { length: Math.min(batchSize, count - i) },
      (_, j) => ({
        title: `Event ${i + j} - ${Math.random().toString(36).substring(2, 10)}`,
        description: `Description for event ${i + j}`,
        date: new Date(Date.now() + Math.floor(Math.random() * 1e9)),
        city: cities[Math.floor(Math.random() * cities.length)],
        created_by: CREATED_BY,
      })
    );

    await prisma.events.createMany({ data: batch });
    console.log(`Inserted ${i + batch.length}/${count}`);
  }

  const elapsed = (Date.now() - start) / 1000;
  console.log(`✅ Done creating ${count} events in ${elapsed.toFixed(2)}s`);
}

async function main() {
  const count = 10000;
  try {
    await resetEvents();
    await createEvents(count);
  } catch (err) {
    console.error("❌ Error seeding events:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
