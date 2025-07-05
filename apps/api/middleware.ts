import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_PUBLIC_KEY } from "./config";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"];

    if (!token) {
        res.status(401).json({
            error: "Unauthorised"
        });
        return;
    }

    const decoded = jwt.verify(token, JWT_PUBLIC_KEY);
    if (!decoded) {
        res.status(401).json({
            error: "Unauthorised"
        });
        return;
    }

    req.userId = decoded.sub as string;
    next();
}