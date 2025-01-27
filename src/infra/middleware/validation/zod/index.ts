import { NextFunction } from 'express';
import { AnyZodObject, ZodError, ZodType, ZodTypeDef } from 'zod';

import { Result } from '@/shared/http/Result';

export const validate =
  <T extends ZodType<any, ZodTypeDef, any>>(schema: AnyZodObject) =>
  async (req: any, res: any, next: NextFunction) => {
    const result = new Result();
    try {
      const validationResult = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        file: req.file,
      });

      req.body = validationResult.body;
      req.query = validationResult.query;
      req.params = validationResult.params;
      req.file = validationResult.file;

      return next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        result.setError(
          error.errors.map((e) => e.message),
          400,
        );
        res.status(+result.statusCode).send(result);
      } else {
        next(error);
      }
    }
  };
