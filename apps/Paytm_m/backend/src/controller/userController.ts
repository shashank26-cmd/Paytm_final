import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const userSecret = "your_jwt_secret_ofuser";

interface AuthenticatedRequest extends Request {
  id?: string; // Add `id` property
}

export const userSignup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
 await  prisma.$transaction(async tx=>{
    const user=await tx.user.create({
      data: { username, password: hashedPassword, name },
    });
await tx.userAccount.create({
  data:{
  userId:user.id
  }
})
  })
    res.status(201).json({ message: "Signed up successfully" });
  } catch (e) {
    res.status(403).json({ message: "Error while signing up" });
  }
};

export const userSignin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    const token = jwt.sign({ id: user.id }, userSecret, { expiresIn: "1h" });
    res.json({ message: "Signed in successfully", token });
  } catch (e) {
    res.status(500).json({ message: "Error while signing in" });
  }
};


export const onRamp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, amount } = req.body;

    const updatedAccount = await prisma.userAccount.update({
      where: { userId }, // Ensure userId is @unique in schema
      data: {
        balance: {
          increment: amount
        }
      }
    });

    res.json({
      message: "onRamp done",
      updatedBalance: updatedAccount.balance
    });

  } catch (error) {
    res.status(400).json({ message: "Error updating balance", error: "message" });
  }
};


export const transfer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { merchantId, amount } = req.body;

    if (!req.id) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const userId = req.id;

    const paymentDone = await prisma.$transaction(async tx => {
      
      await tx.$queryRaw`SELECT * FROM "UserAccount" WHERE "userId" = ${userId} FOR UPDATE`;


      const userAccount = await tx.userAccount.findUnique({
        where: { userId },
      });

      if (!userAccount || userAccount.balance < amount) {
        return false;
      }

      const merchantAccount = await tx.merchantAccount.findUnique({
        where: { merchantId },
      });

      if (!merchantAccount) {
        throw new Error("Merchant not found");
      }

      await tx.userAccount.update({
        where: { userId },
        data: { balance: { decrement: amount } },
      });

      await tx.merchantAccount.update({
        where: { merchantId },
        data: { balance: { increment: amount } },
      });

      return true;
    }, {
      maxWait: 50000,
      timeout: 100000,
    });

    if (!paymentDone) {
      res.status(400).json({ message: "Insufficient balance" });
      return;
    }

    res.json({ message: "Transfer successful" });
  } catch (error) {
    res.status(500).json({ message: "Error processing transfer", error: "message" });
  }
};


