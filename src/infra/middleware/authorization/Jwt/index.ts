import { NextFunction, Response, Request } from 'express';

import { ApplicationError } from '@/shared/error/ApplicationError';
import ApplicationStatusCodes from '@/shared/http/ApplicationStatusCodes';

export const Authorize = (req: Request, _: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token)
    throw new ApplicationError(
      'The resource you are trying to access is protected. No authorization token was provided.',
      ApplicationStatusCodes.UNAUTHORIZED,
    );

  next();
};
