import { z } from 'zod';
import { isRoleValid } from '../enums/roles';
import { requestErrorMessages } from '../errors/request-error-messages';
import { fileSchema, phoneNumberSchema } from './general.validator';

export const signupSchema = z.object({
  name: z.string({ required_error: requestErrorMessages.requiredField('name') }),
  phoneNumber: phoneNumberSchema,
  roleName: z
    .string({ required_error: requestErrorMessages.requiredField('roleName') })
    .refine((role) => isRoleValid(role), 'roleName is not correct'),
});

export const verifySchema = z.object({
  phoneNumber: phoneNumberSchema,
  otpCode: z
    .string({ required_error: requestErrorMessages.requiredField('otpCode') })
    .length(6, { message: 'otpCode must be exactly 6 digits' }),
});

export const completeSignupSchema = z.object({
  profileImage: fileSchema('profileImage'),
  documentFile: fileSchema('documentFile'),
  location: z.object(
    {
      address: z.string({ required_error: requestErrorMessages.requiredField('address') }),
      city: z.string({ required_error: requestErrorMessages.requiredField('city') }),
      country: z.string({ required_error: requestErrorMessages.requiredField('country') }),
      // To-do: regex
      latitude: z.string({ required_error: requestErrorMessages.requiredField('latitude') }),
      longitude: z.string({ required_error: requestErrorMessages.requiredField('longitude') }),
      state: z.string().optional(),
      zipcode: z.string().optional(),
    },
    {
      required_error: requestErrorMessages.requiredObject(
        'location',
        '[address, city, country, latitude, longitude]'
      ),
    }
  ),
});

export const loginSchema = z.object({
  phoneNumber: phoneNumberSchema,
});
