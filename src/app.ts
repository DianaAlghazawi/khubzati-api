import express, { Request, Response } from 'express';
import authRouter from './routes/auth.route';

import { globalErrorHandler } from './middlewares/global-error-handler.middleware';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/v1/auth', authRouter);

app.all('*', (_: Request, res: Response) => {
  res.status(404).json({ status: 'fail', message: 'Not Found' });
});

app.use(globalErrorHandler);

export { app };
