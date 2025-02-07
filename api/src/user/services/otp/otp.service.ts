import * as speakeasy from 'speakeasy';
import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getConfig } from 'src/services/app-config/configuration';

@Injectable()
export class OTPService {
  private resetExpiryTime: number;
  private confirmationExpiryTime: number;
  private secretKey: string;

  constructor(private readonly configService: ConfigService) {
    const authConfig = getConfig();
    if (!authConfig) {
      throw new Error('Auth configuration is missing.');
    }

    this.resetExpiryTime = authConfig.auth?.resetExpiryTime || 300; // Default 5 minutes
    this.confirmationExpiryTime = authConfig.auth?.verifyExpiryTime || 300; // Default 5 minutes
    this.secretKey = authConfig.auth?.otpSecret || 'mysecret'; // Should be in config
  }

  /**
   * Get expiry time for a specific OTP type.
   * @param otpType - Type of OTP (e.g., 'reset_password', 'email_verification')
   */
  private getExpiryTime(otpType: string): number {
    return otpType === 'reset_password'
      ? this.resetExpiryTime
      : this.confirmationExpiryTime;
  }

  public async verifyTimedOtp(
    email: string,
    submittedOtp: string,
    otpType: string = 'default',
  ): Promise<boolean> {
    try {
      const expiryTime = this.getExpiryTime(otpType);
      const key = this.generateBase32Key(email);

      const isValid = speakeasy.totp.verify({
        secret: key,
        encoding: 'base32',
        token: submittedOtp,
        window: 2, // Increase window to allow more time
        step: expiryTime,
        digits: 5,
      });

      return isValid;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return false;
    }
  }

  public async generateTimedOtp(email: string, otpType: string = 'default') {
    try {
      const expiryTime = this.getExpiryTime(otpType);
      const key = this.generateBase32Key(email);

      const otp = speakeasy.totp({
        secret: key,
        encoding: 'base32',
        step: expiryTime,
        digits: 5,
      });

      return {
        otp,
        expiryTime: expiryTime / 60,
        success: true,
      };
    } catch (error) {
      console.error('Error generating OTP:', error);
      return {
        otp: null,
        expiryTime: 0,
        success: false,
        error: 'Failed to generate OTP',
      };
    }
  }

  /**
   * Generate a base32 key for TOTP based on the user's email.
   * @param email - User's email.
   */
  private generateBase32Key(email: string): string {
    try {
      // Generate a deterministic key based on email and secret
      const combinedString = `${email}${this.secretKey}`;
      const hash = crypto
        .createHash('sha256')
        .update(combinedString)
        .digest('hex');

      // Convert to base32 format
      return Buffer.from(hash.substring(0, 20)).toString('base64');
    } catch (error) {
      console.error('Error generating base32 key:', error);
      throw new Error('Failed to generate key');
    }
  }

  /**
   * Test the OTP flow (for debugging purposes only)
   * @param email - Test email address
   */
  public async testOtpFlow(email: string) {
    try {
      // Generate OTP
      const result = await this.generateTimedOtp(email);

      if (!result.success || !result.otp) {
        throw new Error('Failed to generate OTP');
      }

      // Verify immediately
      const isValid = await this.verifyTimedOtp(email, result.otp);

      return {
        otp: result.otp,
        isValid,
        key: this.generateBase32Key(email), // For debugging only
      };
    } catch (error) {
      console.error('Error in test flow:', error);
      return {
        error: 'Test flow failed',
        details: error.message,
      };
    }
  }
}
