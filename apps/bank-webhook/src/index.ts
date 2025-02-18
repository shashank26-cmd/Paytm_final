import express from "express";
import db from "@repo/db/client";
const app = express();

app.use(express.json());

// we are not first fetching balance and then updating because if two parallel req comes then misBalance will Happen
// 0+300
// 0+400
// balannce=400 not 700

app.post("/hdfcWebhook", async (req, res) => {
  //TODO: Add zod validation here?
  //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
  //(Done)TODO: check status processing then only increase amount... DONE
  const paymentInformation: {
    token: string;
    userId: string;
    amount: string;
  } = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };

  const txn = await db.onRampTransaction.findUnique({
    where: { token: paymentInformation.token },
  });
  if (txn?.status == "Success") {
    return res.json("Transaction already done successfully");
  }

  if (txn?.status == "Processing") {
    try {
      await db.$transaction([
        // process both thing or nothing but not any one
        db.balance.updateMany({
          where: {
            userId: Number(paymentInformation.userId),
          },
          data: {
            amount: {
              // db will handle if req comes parallel
              increment: Number(paymentInformation.amount),
            },
          },
        }),
        db.onRampTransaction.updateMany({
          where: {
            token: paymentInformation.token,
          },
          data: {
            status: "Success",
          },
        }),
      ]);

      res.json({
        message: "Captured",
      });
    } catch (e) {
      console.error(e);
      res.status(411).json({
        message: "Error while processing webhook",
      });
    }
  }
});

app.listen(3003);
