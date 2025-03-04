import { getServerSession } from "next-auth";
import prisma from "@repo/db/client";
import { authOptions } from "../auth";
export async function chartjsData() {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id ? Number(session.user.id) : null;
    
        if (!userId) return []; // Handle missing user ID
    
        const txns = await prisma.onRampTransaction.findMany({
            where: { userId },
            orderBy: { startTime: "desc" },
            take: 5,
        });
    
        return txns.map((t) => ({
            time: t.startTime.toISOString(), // Convert Date to string
            amount: t.amount,
        }));
    }