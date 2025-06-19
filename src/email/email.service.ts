import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;
  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  async sendEmailVerification(email: string, token: string) {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;

    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <h2>Email Verification</h2>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendOtpCode(email: string, otpCode: string) {
    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Your OTP Code',
      html: `
        <h2>One-Time Password (OTP)</h2>
        <p>Your OTP code is: <strong>${otpCode}</strong></p>
        <p>This code is valid for 10 minutes.</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendPasswordReset(email: string, token: string) {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;

    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
