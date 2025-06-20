import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  constructor(private config: ConfigService) {}

  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  getExpiration(): Date {
    const secs = this.config.get<number>('OTP_EXPIRATION_SEC') ?? 600;
    return new Date(Date.now() + secs * 1000);
  }

  isExpired(expiry: Date): boolean {
    return !expiry || expiry.getTime() < Date.now();
  }
}
