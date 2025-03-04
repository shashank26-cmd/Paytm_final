import { Router } from "express";
import { merchantSignup, merchantSignin } from "../controller/merchantController";

export const merchantRouter = Router();

merchantRouter.post("/signup", merchantSignup);
merchantRouter.post("/signin", merchantSignin);
