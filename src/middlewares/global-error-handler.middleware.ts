import { ZodError } from 'zod';
import { AppError } from '../errors/app-error';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';

export const handleValidationError = (error: ZodError) => {
  const errorMessage = error.issues.map((issue) => issue.message).join('. ');
  return new AppError(errorMessage, 400);
};

const devErrors = (res: Response, error: AppError) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stackTrace: error.stack,
  });
};

const prodErrors = (res: Response, error: AppError) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong! Please try again later.',
    });
  }
};

export const globalErrorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (req.files) {
    Object.values(req.files)
      .flat()
      .forEach((file) => {
        fs.unlinkSync(file.path);
      });
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR 💥:', error);
    devErrors(res, error);
  } else if (process.env.NODE_ENV === 'production') {
    prodErrors(res, error);
  }
};
