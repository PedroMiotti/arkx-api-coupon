import { NextFunction, Request, Response } from 'express';

import logger from '@/shared/logger';
import { Result } from '@/shared/http/Result';
import { ApplicationError } from '@/shared/error/ApplicationError';

class HandlerErrorMiddleware {
  public handler(err: ApplicationError, _: Request, res: Response, next: NextFunction): void {
    const result = new Result();

    if (err?.name === 'ApplicationError') {
      result.setError(err.message, err.errorCode);
    } else {
      logger.error('Error caught on error middleware: ', err);
      result.setError('SOMETHING_WENT_WRONG', 500);
    }

    if (res.headersSent) {
      return next(result);
    }

    res.status(+result.statusCode).send(result);
  }
}

export default new HandlerErrorMiddleware();
