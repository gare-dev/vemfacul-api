import { Request, Response, NextFunction } from "express";

export function errorLogger(err: any, req: Request, res: Response, next: NextFunction) {
    res.locals.errorMessage = err.message;
    res.locals.errorStack = err.stack;
    next(err);
}
