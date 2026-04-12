import { Logger } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

const logger = new Logger('HTTP');

export function httpRequestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const requestId = res.getHeader('x-request-id') as string | undefined;
    const prefix = requestId ? `[${requestId}] ` : '';
    const log = `${prefix}${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
    if (res.statusCode >= 500) {
      logger.error(log);
    } else if (res.statusCode >= 400) {
      logger.warn(log);
    } else {
      logger.log(log);
    }
  });
  next();
}
