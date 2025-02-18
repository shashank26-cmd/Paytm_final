import { Card } from "@repo/ui/card";

export const P2PTransactions = ({
  transactions,
  cardTitle,
}: {
  transactions: {
    time: Date;
    amount: number;
    txnType: string;
    party: number;
  }[];
  cardTitle: string;
}) => {
  if (!transactions.length) {
    return (
      <Card title={cardTitle}>
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    );
  }
  return (
    <Card title={cardTitle}>
      <div className="pt-2">
        {transactions.map((t) => (
          <div
            className={`${t.txnType == "sen" ? "bg-red-200" : "bg-green-200"} flex justify-between mb-2 px-2 rounded-md`}
          >
            <div>
              <div className="text-sm">
                {t.txnType !== "sen" ? "Received" : "Sent"} INR
              </div>
              <div className="text-sm">UserID: {t.party}</div>
              <div className="text-slate-600 text-xs">
                {t.time.toDateString()}
              </div>
            </div>
            <div
              className={`${t.txnType == "sen" ? "text-red-900" : "text-green-800"} flex flex-col justify-center text-2xl`}
            >
              {t.txnType !== "sen" ? "+ ₹" : "- ₹"} {t.amount / 100}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
