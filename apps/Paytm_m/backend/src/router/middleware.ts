import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const userSecret = "your_jwt_secret_ofuser";
const merchantSecret = "your_jwt_secret_ofmerchant";

const authenticate = (secret: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {  // Explicit return type
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(403).json({ message: "Not Authorized" });
      return;
    }

    const token = authHeader.split(" ")[1]; // Extract the token
    try {
      const decoded = jwt.verify(token, secret) as { id: string };
      (req as any).id = decoded.id; // Attach `id` to request object
      next();  // Ensure `next()` is called
    } catch (err) {
      res.status(403).json({ message: "Invalid Token" });
    }
  };
};


// User Authentication Middleware
export const userAuthMiddleware = authenticate(userSecret);

// Merchant Authentication Middleware
export const merchantAuthMiddleware = authenticate(merchantSecret);
