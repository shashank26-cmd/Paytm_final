import { Router } from "express";
import { userSignup, userSignin, onRamp, transfer } from "../controller/userController";
import { userAuthMiddleware } from "./middleware";

export const userRouter = Router();

userRouter.post("/signup", userSignup);
userRouter.post("/signin", userSignin);
userRouter.post("/onRamp", onRamp);
userRouter.post("/tranfer",userAuthMiddleware, transfer);

