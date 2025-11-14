import { RateLimiterMemory } from "rate-limiter-flexible";
import { Request, Response, NextFunction } from "express";

const SPECIFIC_ENDPOINTS = [
    "/posts/report",
];

const generalRateLimiter = new RateLimiterMemory({
    points: 15,        // 10 requests
    duration: 5,       // por 5 segundos
    blockDuration: 60   // bloqueia por 1 minuto
});

const sensitiveRateLimiter = new RateLimiterMemory({
    points: 10,          // 5 requests
    duration: 5,         // por minuto
    blockDuration: 3000  // bloqueia por 5 minutos
});

function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
    const clientIp = req.ip ?? '0.0.0.0';

    const isSpecificEndpoint = SPECIFIC_ENDPOINTS.includes(req.path);
    const rateLimiter = isSpecificEndpoint ? sensitiveRateLimiter : generalRateLimiter;
    const endpointType = isSpecificEndpoint ? 'sensitive' : 'general';

    rateLimiter.consume(clientIp)
        .then((resRateLimiter) => {
            res.setHeader('X-RateLimit-Limit', rateLimiter.points);
            res.setHeader('X-RateLimit-Remaining', resRateLimiter.remainingPoints);

            next();
        })
        .catch((resRateLimiter) => {
            res.setHeader('X-RateLimit-Limit', rateLimiter.points);
            res.setHeader('X-RateLimit-Remaining', 0);
            res.setHeader('Retry-After', Math.round(resRateLimiter.msBeforeNext / 1000));

            console.log(`🚫 Rate limit exceeded for ${endpointType} endpoint from IP: ${clientIp}`);

            return res.status(429).json({
                error: "Too Many Requests",
                message: `Rate limit exceeded for ${endpointType} endpoints`,
                retryAfter: Math.round(resRateLimiter.msBeforeNext / 1000)
            });
        });
}

export default rateLimitMiddleware;