import { Request, Response, NextFunction } from "express";
import pool from "../db/connect";
import { JWTClass } from "../../utils/jwt";
import { v4 as uuidv4 } from 'uuid';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const jwt = new JWTClass(process.env.SECRET!)
    const uuid = uuidv4()
    const ignoredRoutes = ["/admin/api/log"];
    if (ignoredRoutes.includes(req.originalUrl)) {
        return next();
    }

    res.setHeader("X-Trace-Id", uuid);

    const start = Date.now();
    const { method, originalUrl, query, body, headers } = req;
    const environment = process.env.NODE_ENV || "development";
    const userId = jwt.verifyJWT(req.cookies.token || "")?.id || null

    let responseBody: any;
    const originalSend = res.send;

    (res as any).send = function (bodyToSend: any) {
        responseBody = bodyToSend;
        return originalSend.call(this, bodyToSend);
    };

    res.on("finish", async () => {
        const duration = Date.now() - start;
        const statusCode = res.statusCode;
        const responseSize = responseBody ? JSON.stringify(responseBody).length : 0;

        try {
            await pool.query(
                `INSERT INTO request_logs 
          (timestamp, method, url, query_params, request_body, request_headers, 
           status_code, response_body, response_size, duration_ms, 
           user_id, environment, error_message, error_stack, trace_id)
         VALUES 
          (NOW(), $1, $2, $3, $4, $5,
           $6, $7, $8, $9,
           $10, $11, $12, $13, $14)`,
                [
                    method,
                    originalUrl,
                    query ? JSON.stringify(query) : null,
                    body ? JSON.stringify(body) : null,
                    headers ? JSON.stringify(headers) : null,
                    statusCode,
                    responseBody ? JSON.stringify(responseBody) : null,
                    responseSize,
                    duration,
                    userId,
                    environment,
                    res.locals.errorMessage || null,
                    res.locals.errorStack || null,
                    uuid
                ]
            );
        } catch (err) {
            console.error("Erro ao salvar log:", err);
        }
    });

    next();
};
