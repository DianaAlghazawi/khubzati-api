import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';

export class JWTService {
  static generateAccessToken(data: object): string {
    return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: '1 day' });
  }
}
