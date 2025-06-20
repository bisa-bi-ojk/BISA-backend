import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { createTransport, SentMessageInfo } from 'nodemailer';
import { join } from 'path';

@Injectable()
export class EmailService {
  private transporter = this.createTransporter();
  private readonly from: string;
  private readonly frontendUrl: string;

  constructor(private readonly config: ConfigService) {
    const emailFrom = this.config.get<string>('EMAIL_FROM');
    const frontendUrl = this.config.get<string>('FRONTEND_URL');

    if (!emailFrom || !frontendUrl) {
      throw new InternalServerErrorException(
        'EMAIL_FROM and FRONTEND_URL must be set in your environment',
      );
    }

    this.from = emailFrom;
    this.frontendUrl = frontendUrl;
  }

  private createTransporter() {
    const user = this.config.get<string>('EMAIL_USER');
    const pass = this.config.get<string>('EMAIL_PASS');
    if (!user || !pass) {
      throw new InternalServerErrorException(
        'EMAIL_USER and EMAIL_PASS must be set',
      );
    }
    return createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  private loadTemplate(
    name: 'verify-email' | 'otp-code' | 'password-reset' | 'email-confirmation',
  ): string {
    const file = join(
      process.cwd(),
      'src',
      'email',
      'templates',
      `${name}.html`,
    );
    return readFileSync(file, 'utf8');
  }

  private async sendMail(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<SentMessageInfo> {
    try {
      return await this.transporter.sendMail({
        from: this.from,
        ...options,
      });
    } catch {
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async sendEmailVerification(email: string, token: string) {
    let html = this.loadTemplate('verify-email');
    const url = `${this.frontendUrl}/verify-email?token=${token}`;
    html = html.replace(/{{url}}/g, url);
    return this.sendMail({
      to: email,
      subject: 'Verify Your Email Address',
      html,
    });
  }

  async sendOtpCode(email: string, otp: string) {
    let html = this.loadTemplate('otp-code');
    html = html.replace(/{{otp}}/g, otp);
    return this.sendMail({
      to: email,
      subject: 'Your OTP Code',
      html,
    });
  }

  async sendEmailConfirmation(email: string) {
    const html = this.loadTemplate('email-confirmation');
    return this.sendMail({
      to: email,
      subject: 'Your Email Has Been Verified!',
      html,
    });
  }

  async sendPasswordReset(email: string, token: string) {
    let html = this.loadTemplate('password-reset');
    const url = `${this.frontendUrl}/reset-password?token=${token}`;
    html = html.replace(/{{resetUrl}}/g, url);
    return this.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html,
    });
  }
}
