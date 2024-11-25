import bcrypt from 'bcrypt';

interface OTP {
  otpHash: string;
  expiration: Date;
}

export class OTPService {
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP [100000 - 999999]
  }

  static async hashOTP(otp: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp.toString(), salt);
    return hashedOTP;
  }

  static async compare(userOtp: string, hashedOtp: string): Promise<boolean> {
    return await bcrypt.compare(userOtp.toString(), hashedOtp);
  }

  static isExpired(otpExpiration: Date): boolean {
    return otpExpiration < new Date();
  }
}
