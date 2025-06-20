import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { OtpService } from '../common/services/otp.service';
import { TokenService } from '../common/services/token.service';
import { User } from '../database/schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly repo: UserRepository,
    private readonly tokens: TokenService,
    private readonly otps: OtpService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existing = await this.repo.findByEmail(dto.email);
    if (existing && existing.emailVerified) {
      throw new ConflictException('Email already registered');
    }

    const hashed = await bcrypt.hash(dto.password, 12);

    return dto.role === 'admin'
      ? this.registerAdmin(existing, dto, hashed)
      : this.registerCitizen(existing, dto, hashed);
  }

  private async registerAdmin(
    existing: User | null,
    dto: CreateUserDto,
    hashedPassword: string,
  ): Promise<User> {
    const token = this.tokens.generateToken();
    const expires = this.tokens.getExpiration();

    const fields = {
      fullName: dto.fullName,
      phone: dto.phone,
      password: hashedPassword,
      role: dto.role,
      emailVerificationToken: token,
      emailVerificationExpires: expires,
      otpCode: null,
      otpExpires: null,
    } as Partial<User>;

    if (existing) {
      return this.repo.update(existing.id, fields);
    }
    return this.repo.create({ email: dto.email, ...fields } as any);
  }

  private async registerCitizen(
    existing: User | null,
    dto: CreateUserDto,
    hashedPassword: string,
  ): Promise<User> {
    const code = this.otps.generateCode();
    const expires = this.otps.getExpiration();

    const fields = {
      fullName: dto.fullName,
      phone: dto.phone,
      password: hashedPassword,
      role: dto.role,
      otpCode: code,
      otpExpires: expires,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    } as Partial<User>;

    if (existing) {
      return this.repo.update(existing.id, fields);
    }
    return this.repo.create({ email: dto.email, ...fields } as any);
  }

  async verifyEmail(token: string): Promise<boolean> {
    const user = await this.repo.findByVerificationToken(token);
    if (
      !user ||
      !user.emailVerificationExpires ||
      this.tokens.isExpired(user.emailVerificationExpires)
    ) {
      return false;
    }

    await this.repo.update(user.id, {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    });
    return true;
  }

  async verifyOtpCode(email: string, code: string): Promise<boolean> {
    const user = await this.repo.findByEmail(email);
    if (
      !user ||
      user.otpCode !== code ||
      !user.otpExpires ||
      this.otps.isExpired(user.otpExpires)
    ) {
      return false;
    }

    await this.repo.update(user.id, {
      emailVerified: true,
      otpCode: null,
      otpExpires: null,
    });
    return true;
  }

  async setPasswordResetToken(email: string): Promise<string | null> {
    const user = await this.repo.findByEmail(email);
    if (!user) return null;

    const token = this.tokens.generateToken();
    const expires = this.tokens.getExpiration();

    await this.repo.update(user.id, {
      passwordResetToken: token,
      passwordResetExpires: expires,
    });
    return token;
  }

  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<boolean> {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.repo.findByPasswordResetToken(token);
    if (
      !user ||
      !user.passwordResetExpires ||
      this.tokens.isExpired(user.passwordResetExpires)
    ) {
      throw new NotFoundException('Invalid or expired password reset token');
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await this.repo.update(user.id, {
      password: hashed,
      passwordResetToken: null,
      passwordResetExpires: null,
    });
    return true;
  }
}
