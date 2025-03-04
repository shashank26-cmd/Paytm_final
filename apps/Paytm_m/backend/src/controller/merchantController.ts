import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const merchantSecret = "your_jwt_secret_ofmerchant";

export const merchantSignup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
   await prisma.$transaction(async tx=> {
    const merchant=await tx.merchant.create({
      data: { username, password: hashedPassword, name },
    });


    await tx.merchantAccount.create({
      data:{
        merchantId:merchant.id
      }
    })
   })
   
    res.status(201).json({ message: "Signed up successfully" });
  } catch (e) {
    res.status(403).json({ message: "Error while signing up" });
  }
};

export const merchantSignin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const merchant = await prisma.merchant.findUnique({ where: { username } });

    if (!merchant || !(await bcrypt.compare(password, merchant.password))) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    const token = jwt.sign({ id: merchant.id }, merchantSecret, { expiresIn: "1h" });
    res.json({ message: "Signed in successfully", token });
  } catch (e) {
    res.status(500).json({ message: "Error while signing in" });
  }
};
