import * as speakeasy from 'speakeasy';
import { ConfigService } from '@nestjs/config';
import { getConfig } from 'src/services/app-config/configuration';

export default class OTPService {
  private resetExpiryTime: number;
  private confirmationExpiryTime: number;

  constructor(private readonly configService: ConfigService) {
    const authConfig = getConfig();
    if (!authConfig) {
      throw new Error('Auth configuration is missing.');
    }

    this.resetExpiryTime = authConfig.auth.resetExpiryTime || 300; // Default 5 minutes
    this.confirmationExpiryTime = authConfig.auth.verifyExpiryTime || 300; // Can be moved to config if dynamic
  }

  /**
   * Get expiry time for a specific OTP type.
   * @param otpType - Type of OTP (e.g., 'reset_password')
   */
  private getExpiryTime(otpType: string): number {
    return otpType === 'reset_password'
      ? this.resetExpiryTime
      : this.confirmationExpiryTime;
  }

  /**
   * Generate a time-based OTP (TOTP).
   * @param email - User's email.
   * @param otpType - OTP type (default: 'default').
   */
  public async generateTimedOtp(email: string, otpType: string = 'default') {
    const expiryTime = this.getExpiryTime(otpType);

    const key = this.generateBase32Key(email);

    const otp = speakeasy.totp({
      secret: key,
      encoding: 'base32',
      step: expiryTime,
      digits: 5,
    });

    // Logically, you can save OTP or perform additional actions here
    return { otp, expiryTime: expiryTime / 60 }; // Expiry in minutes
  }

  /**
   * Verify the time-based OTP (TOTP).
   * @param email - User's email.
   * @param submittedOtp - OTP submitted by the user.
   * @param otpType - OTP type (default: 'default').
   */
  public async verifyTimedOtp(
    email: string,
    submittedOtp: string,
    otpType: string = 'default',
  ): Promise<boolean> {
    const expiryTime = this.getExpiryTime(otpType);

    const key = this.generateBase32Key(email);

    return speakeasy.totp.verify({
      secret: key,
      encoding: 'base32',
      token: submittedOtp,
      window: 1,
      step: expiryTime,
    });
  }

  /**
   * Generate a base32 key for TOTP based on the user's email.
   * @param email - User's email.
   */
  private generateBase32Key(email: string): string {
    const rawKey = Buffer.from(email).toString('base64').substring(0, 32);
    const secretKey = 'mysecret';

    return `${rawKey}${secretKey}`;
  }
}
