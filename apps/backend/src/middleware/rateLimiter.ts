import { Request, Response, NextFunction } from 'express';
import { getRedis } from '../config/redis';

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // requests per window

export async function rateLimiter(req: Request, res: Response, next: NextFunction) {
  try {
    const redis = getRedis();
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const key = `rate_limit:${clientIp}`;
    
    const current = await redis.get(key);
    
    if (current === null) {
      await redis.setEx(key, Math.ceil(RATE_LIMIT_WINDOW / 1000), '1');
      return next();
    }
    
    const requests = parseInt(current);
    
    if (requests >= RATE_LIMIT_MAX_REQUESTS) {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.'
      });
    }
    
    await redis.incr(key);
    next();
  } catch (error) {
    console.error('Rate limiter error:', error);
    next(); // Continue on error to avoid blocking requests
  }
}