import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).json({
    status: 'suceesss',
    data: 'welcomeee',
  });
});

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ status: 'fail', message: 'Not Found' });
});

app.listen(port, async () => {
  try {
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
