import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();
    // check if name and email are provided
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check if user exists using email as email is unique 
    let user = await prisma.users.findUnique({
      where: { email },
    });
    return NextResponse.json(
      { id: user.id, name: user.name, email: user.email },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
