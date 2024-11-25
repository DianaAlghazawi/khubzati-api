import dotenv from 'dotenv';
dotenv.config();

export const config = {
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // Default 5MB in bytes
  acceptedFileTypes: process.env.ACCEPTED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/png'],
};
