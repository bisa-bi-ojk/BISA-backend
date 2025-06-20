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
    name:
      | 'verify-email'
      | 'otp-code'
      | 'email-confirmation'
      | 'password-reset'
      | 'password-reset-success',
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

  async sendEmailVerification(email: string, token: string, name: string) {
    let html = this.loadTemplate('verify-email');
    const url = `${this.frontendUrl}/verify-email?token=${token}`;
    html = html.replace(/{{url}}/g, url).replace(/{{name}}/g, name);
    return this.sendMail({
      to: email,
      subject: 'Verifikasi Email Anda - BISA',
      html,
    });
  }

  async sendOtpCode(email: string, otp: string, name: string) {
    let html = this.loadTemplate('otp-code');
    html = html.replace(/{{otp}}/g, otp).replace(/{{name}}/g, name);
    return this.sendMail({
      to: email,
      subject: 'Kode OTP Anda - BISA',
      html,
    });
  }

  async sendEmailConfirmation(email: string, name: string) {
    let html = this.loadTemplate('email-confirmation');
    html = html.replace(/{{name}}/g, name);
    return this.sendMail({
      to: email,
      subject: 'Email Berhasil Dikonfirmasi - BISA',
      html,
    });
  }

  async sendPasswordReset(email: string, token: string, name: string) {
    let html = this.loadTemplate('password-reset');
    const url = `${this.frontendUrl}/reset-password?token=${token}`;
    html = html.replace(/{{resetUrl}}/g, url).replace(/{{name}}/g, name);
    return this.sendMail({
      to: email,
      subject: 'Reset Password - BISA',
      html,
    });
  }

  async sendPasswordResetSuccess(email: string, name: string) {
    let html = this.loadTemplate('password-reset-success');
    const timestamp = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      dateStyle: 'full',
      timeStyle: 'short',
    });
    html = html.replace(/{{name}}/g, name).replace(/{{timestamp}}/g, timestamp);
    return this.sendMail({
      to: email,
      subject: 'Password Berhasil Diubah - BISA',
      html,
    });
  }
}
