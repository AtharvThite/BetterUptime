import type { Request, Response, NextFunction } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const header = req.headers["authorization"];

    req.userId = "1";
    next();
}