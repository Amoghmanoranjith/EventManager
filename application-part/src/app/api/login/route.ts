import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/login
export async function POST(req: Request) {
    try {
        const { name, email } = await req.json();

        if (!name || !email) {
            return NextResponse.json(
                { error: "Name and email are required" },
                { status: 400 }
            );
        }

        // Check if user exists using both name and email
        // email is unique, we take name so that we can get a low level auth by matching the name to email
        let user = await prisma.users.findFirst({
            where: {
                AND: [
                    { email: email },
                    { name: name }
                ]
            },
        });
        // if user is not found then return not found error
        if(!user){
            return NextResponse.json({error: "User not found"},{status : 404})
        }
        return NextResponse.json(
            { id: user.id, name: user.name, email: user.email },
            { status: 200 }
        );
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
