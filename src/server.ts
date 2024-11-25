import dotenv from 'dotenv';
import { app } from './app';

dotenv.config();

process.on('uncaughtException', (err: Error) => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception occurred! Shutting down...');
  process.exit(1);
});

const port = process.env.PORT || 3000;

const server = app.listen(port, async () => {
  try {
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

process.on('unhandledRejection', (err: Error) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection occurred! Shutting down...');

  server.close(() => process.exit(1));
});
