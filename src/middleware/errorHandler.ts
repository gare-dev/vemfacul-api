import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/HttpError";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
            error: err.message,
            code: err.code
        })
    }

    console.log("Unexpected error. " + err)
    return res.status(500).json({
        error: "Server error.",
    })
}