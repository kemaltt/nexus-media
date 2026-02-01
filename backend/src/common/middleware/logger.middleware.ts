import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      const contentLength = res.get('content-length');

      // Color coding for status
      let statusColor = '\x1b[32m'; // Green for 2xx
      if (statusCode >= 300) statusColor = '\x1b[33m'; // Yellow for 3xx
      if (statusCode >= 400) statusColor = '\x1b[31m'; // Red for 4xx/5xx
      const resetColor = '\x1b[0m';

      const logMessage = `${method} ${originalUrl} ${statusColor}${statusCode}${resetColor} in ${duration}ms`;

      this.logger.log(logMessage);
    });

    next();
  }
}
