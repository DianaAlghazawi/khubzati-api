import { NextFunction, Request, Response } from 'express';
import prisma from '../prismaClient';
import { validateRequest } from '../middlewares/validate-request.middleware';
import {
  completeSignupSchema,
  loginSchema,
  signupSchema,
  verifySchema,
} from '../validators/auth.validator';
import { asyncErrorHandler } from '../middlewares/async-error-handler.middleware';
import { AppError } from '../errors/app-error';
import { getRoleByEnumName } from '../enums/roles';
import { OTPService } from '../services/otp-service';
import { JWTService } from '../services/jwt-service';
import { authenticateToken } from '../middlewares/validate-token.middleware';
import { v4 as uuidv4 } from 'uuid';
import { generateOTPData, mergeRequestData } from '../utils/utils';
import path from 'path';
import { FINAL_DIR } from '../middlewares/upload-file.middleware';
import fs from 'fs';
import { sendResponse } from '../utils/responseHelper';

const signup = [
  validateRequest(signupSchema),
  asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, phoneNumber, roleName } = { ...req.body };

    const isUserExistAndVerified = await prisma.user.findUnique({
      where: {
        phoneNumber: phoneNumber,
        isVerified: true,
      },
    });

    if (isUserExistAndVerified) return next(new AppError('Phone Number is already exist', 409));

    const role = await getRoleByEnumName(roleName);
    const otpData = await generateOTPData(phoneNumber);

    const userData = {
      name: name,
      phoneNumber: phoneNumber,
      roleId: role.id,
      ...otpData,
    };

    await prisma.user.upsert({
      where: {
        phoneNumber: phoneNumber,
      },
      create: userData,
      update: userData,
    });

    sendResponse({
      res: res,
      statusCode: 201,
      message: 'Registration successful! Please verify your email to activate your account',
    });
  }),
];

const verify = [
  validateRequest(verifySchema),
  asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber, otpCode } = { ...req.body };
    const user = await prisma.user.findUnique({
      where: {
        phoneNumber: phoneNumber,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      return next(new AppError('Phone Number not found', 404));
    }

    if (user.otpCode == null || !(await OTPService.compare(otpCode, user.otpCode!))) {
      return next(new AppError('OTP code is invalid', 401));
    }

    if (OTPService.isExpired(user.otpExpiration!)) {
      return next(new AppError('OTP code is expired', 401));
    }

    await prisma.user.update({
      data: {
        isVerified: true,
        otpExpiration: null,
        otpCode: null,
      },
      where: {
        phoneNumber: phoneNumber,
      },
    });

    const accessToken = JWTService.generateAccessToken({
      id: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      roleName: user.role.nameEn,
      isVerified: true,
      isActivated: user.isActive,
    });

    sendResponse({
      res: res,
      statusCode: 200,
      message: 'OTP verified successfully',
      data: {
        accessToken: accessToken,
      },
    });
  }),
];

const completeSignup = [
  validateRequest(completeSignupSchema),
  authenticateToken,
  asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const data = mergeRequestData(req);
    const user = req.user;

    const { location, profileImage, documentFile } = data;

    const userDB = await prisma.user.findUnique({
      where: {
        id: user!.id,
      },
    });

    if (userDB?.isActive) {
      return next(new AppError('The account is already active', 409));
    }
    await prisma.user.update({
      where: { id: userDB!.id },
      data: {
        isActive: true,
        profileImage: {
          create: {
            name: profileImage[0].originalname,
            path: profileImage[0].path,
            type: profileImage[0].mimetype,
            size: profileImage[0].size,
          },
        },
        documentFile: {
          create: {
            name: documentFile[0].originalname,
            path: documentFile[0].path,
            type: documentFile[0].mimetype,
            size: documentFile[0].size,
          },
        },
      },
    });

    const myUUID: string = uuidv4();
    location['id'] = myUUID;
    location['userId'] = userDB!.id;
    await prisma.location.create(location);

    if (req.files) {
      Object.values(req.files)
        .flat()
        .forEach((file) => {
          const tempFilePath = file.path;
          const finalFilePath = path.join(FINAL_DIR, file.filename);
          fs.renameSync(tempFilePath, finalFilePath); // Move file
        });
    }

    sendResponse({
      res: res,
      statusCode: 200,
      message: 'Complete registration successful',
    });
  }),
];

export const login = [
  validateRequest(loginSchema),
  asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber } = { ...req.body };
    const user = await prisma.user.findUnique({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (!user) {
      return next(new AppError('Phone Number not found', 404));
    }
    const otpData = await generateOTPData(phoneNumber);

    const userData = {
      phoneNumber: phoneNumber,
      ...otpData,
    };

    await prisma.user.update({
      where: {
        phoneNumber: phoneNumber,
      },

      data: userData,
    });

    sendResponse({
      res: res,
      statusCode: 200,
    });
  }),
];

export { signup, verify, completeSignup };
