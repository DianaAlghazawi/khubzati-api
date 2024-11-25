import { z } from 'zod';
import { config } from '../config';
import { requestErrorMessages } from '../errors/request-error-messages';

export const fileSchema = (fieldName: string) =>
  z
    .array(z.any(), { required_error: `${fieldName} field is required` })
    .refine(
      (files) => files.every((file) => file.size <= config.maxFileSize),
      requestErrorMessages.maxSize(fieldName)
    )
    .refine(
      (files) => files.every((file) => config.acceptedFileTypes.includes(file.mimetype)),
      requestErrorMessages.acceptedTypes(fieldName)
    );

export const phoneNumberSchema = z
  .string({ required_error: requestErrorMessages.requiredField('phoneNumber') })
  .regex(/^\+[1-9]{1}[0-9]{3,14}$/, {
    message:
      'phoneNumber must be in the format + followed by 4 to 15 digits, starting with a non-zero digit',
  });
