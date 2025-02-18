import { NextResponse } from "next/server";
import prisma from "@repo/db/client"; // Ensure this resolves correctly

export const GET = async () => {
    try {
        const user = await prisma.user.create({
            data: {
                email: "asd",
                name: "adsads",
                number: "1234567890", // Required field
                password: "securepassword", // Required field (should be hashed)
            },
        });

        return NextResponse.json({
            message: "User created successfully",
            user,
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
        );
    }
};
