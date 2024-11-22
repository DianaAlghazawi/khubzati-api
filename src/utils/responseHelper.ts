import { Response } from 'express';

interface ResponseData<T = null> {
  status: string;
  message: string;
  data?: T;
}

export const sendResponse = ({
  res,
  statusCode,
  message = '',
  status = 'success',
  data = {},
}: {
  res: Response;
  statusCode: number;
  message?: string;
  status?: string;
  data?: object;
}): Response => {
  const responseBody = { status, message, data };
  return res.status(statusCode).json(responseBody);
};
