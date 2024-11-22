import { Request } from 'express';
import { OTPService } from '../services/otp-service';

export const mergeRequestData = (req: Request) => {
  const data = { ...req.body };

  if (req.files) {
    Object.entries(req.files).forEach(([key, value]) => {
      data[key] = Array.isArray(value) ? value.map((file) => file) : value;
    });
  }

  return data;
};

export const generateOTPData = async (phoneNumber: string) => {
  const currentDate = new Date();
  currentDate.setMinutes(currentDate.getMinutes() + 5);
  return {
    otpCode: await OTPService.hashOTP('123456'),
    otpExpiration: currentDate,
  };
};
