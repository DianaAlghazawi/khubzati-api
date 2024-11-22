import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { handleValidationError } from './global-error-handler.middleware';
import { mergeRequestData } from '../utils/utils';

export const validateRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = mergeRequestData(req);

      schema.parse(data);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(handleValidationError(error));
      } else {
        next(error);
      }
    }
  };
