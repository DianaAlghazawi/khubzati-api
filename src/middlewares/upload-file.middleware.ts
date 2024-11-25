import fs from 'fs';
import path from 'path';
import multer, { Field } from 'multer';
import { AppError } from '../errors/app-error';
export const TEMP_DIR = path.join(process.cwd(), 'temp-uploads');
export const FINAL_DIR = path.join(process.cwd(), 'uploads');

// Ensure directories exist
fs.mkdirSync(TEMP_DIR, { recursive: true });
fs.mkdirSync(FINAL_DIR, { recursive: true });

const tempStorage = multer.diskStorage({
  destination: TEMP_DIR,
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 10000); // Generates a random number between 0 and 9999
    const fileExtension = path.extname(file.originalname); // Extracts the file extension
    const baseName = path.basename(file.originalname, fileExtension); // Extracts the base file name

    const uniqueFileName = `${timestamp}-${randomNumber}-${baseName}${fileExtension}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: tempStorage });

export const uploadFile = (fields: readonly Field[]) => (req, res, next) => {
  upload.fields(fields)(req, res, (err) => {
    if (err) {
      return next(new AppError(`${err.field} upload error, details: ${err.code}`, 400));
    }
    next();
  });
};
