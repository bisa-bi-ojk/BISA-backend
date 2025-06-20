import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(private config: ConfigService) {}

  generateToken(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  getExpiration(): Date {
    const secs =
      this.config.get<number>('EMAIL_VERIFICATION_EXPIRATION_SEC') || 86400;
    return new Date(Date.now() + secs * 1000);
  }

  isExpired(expiry: Date): boolean {
    return !expiry || expiry.getTime() < Date.now();
  }
}
