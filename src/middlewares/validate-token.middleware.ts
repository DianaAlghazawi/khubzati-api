import jwt from 'jsonwebtoken';
import { Response, NextFunction, Request } from 'express';
import { AppError } from '../errors/app-error';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return next(new AppError('Token is invalid', 401));

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, payload: any) => {
    if (err) return next(new AppError('Token is invalid', 403));

    req.user = payload;
    next();
  });
}
