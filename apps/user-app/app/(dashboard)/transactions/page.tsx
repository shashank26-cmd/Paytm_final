import { Card } from "@repo/ui/card";
import { P2PTransactions } from "../../../components/P2PTransactions";
import { OnRampTransactions } from "../../../components/OnRampTransactions"; 
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ? Number(session.user.id) : null;

    if (!userId) return []; // Handle missing user ID

    const txns = await prisma.onRampTransaction.findMany({
        where: { userId },
        orderBy: { startTime: 'desc' },
        take: 5
    });

    return txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }));
}

async function getP2PTransactions() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ? Number(session.user.id) : null;

    if (!userId) return { sent: [], received: [] };

    const sentTxns = await prisma.p2pTransfer.findMany({
        where: { fromUserId: userId },
        orderBy: { timestamp: 'desc' },
        take: 3
    });

    const receivedTxns = await prisma.p2pTransfer.findMany({
        where: { toUserId: userId },
        orderBy: { timestamp: 'desc' },
        take: 3
    });

    return {
        sent: sentTxns.map(t => ({
            time: t.timestamp,
            amount: t.amount,
            txnType: "sen",
            party: Number(t.toUserId)
        })),
        received: receivedTxns.map(t => ({
            time: t.timestamp,
            amount: t.amount,
            txnType: "rec",
            party: Number(t.fromUserId)
        }))
    };
}

export default async function() {

    const balance = await getBalance();
    const allOnRampTransactions = await getOnRampTransactions();
    const allP2PTransactions = await getP2PTransactions()

    return <div className="w-full">
        <div className="w-fit">
            <Card title="Current Balance">
                <div className="text-slate-600  text-4xl">₹{balance.amount / 100}</div>
            </Card>
        </div>
        <div className="flex justify-evenly space-x-4">
            <div className="w-full">
                <p className="text-4xl text-[#6a51a6] pt-8 mb-2 font-bold">P2P Transactions</p>
                <div className="flex space-x-4">
                    <P2PTransactions transactions={allP2PTransactions.sent} cardTitle="Sent"/>
                    <P2PTransactions transactions={allP2PTransactions.received} cardTitle="Received"/>
                </div>
            </div>
            <div className="w-full">
                <p className="text-4xl text-[#6a51a6] pt-8 mb-2 font-bold">Wallet Transactions</p>
                <OnRampTransactions transactions={allOnRampTransactions} />
            </div>
        </div>
    </div>
}