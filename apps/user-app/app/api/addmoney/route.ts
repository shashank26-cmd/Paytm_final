import prisma from "@repo/db/client";

export const POST = async (req: Request) => {
    const txn = await req.json()
    
    const newTxn = await prisma.onRampTransaction.create({data: txn})
    // const user = await prisma.user.findUnique({where: {email: session?.user?.email}})
    // if (user) {
    //     user.OnRampTransaction.
    // }

    return new Response(JSON.stringify(newTxn), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 201
    })
}   