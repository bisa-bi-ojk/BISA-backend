import {
  Injectable,
  Inject,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { DATABASE_CONNECTION } from '../database/database.module';
import { users, User, NewUser } from '../database/schema';
import { CreateUserDto } from './dto/create-user.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../database/schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.findByEmail(createUserDto.email);

    if (existingUser && existingUser.emailVerified) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    const baseFields = {
      fullName: createUserDto.fullName,
      phone: createUserDto.phone,
      password: hashedPassword,
      role: createUserDto.role,
    } as Partial<NewUser>;

    if (createUserDto.role === 'admin') {
      const emailVerificationToken = this.generateToken();
      const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60_000);

      const fields = {
        ...baseFields,
        emailVerificationToken,
        emailVerificationExpires,
        otpCode: null,
        otpExpires: null,
      } as Partial<NewUser>;

      if (existingUser) {
        const [user] = await this.db
          .update(users)
          .set(fields)
          .where(eq(users.id, existingUser.id))
          .returning();
        return user;
      }

      const newUser: NewUser = {
        ...fields,
        email: createUserDto.email,
      } as NewUser;
      const [user] = await this.db.insert(users).values(newUser).returning();
      return user;
    } else if (createUserDto.role === 'citizen') {
      const otpCode = this.generateOtpCode();
      const otpExpires = new Date(Date.now() + 10 * 60_000);

      const fields = {
        ...baseFields,
        otpCode,
        otpExpires,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      } as Partial<NewUser>;

      if (existingUser) {
        const [user] = await this.db
          .update(users)
          .set(fields)
          .where(eq(users.id, existingUser.id))
          .returning();
        return user;
      }

      const newUser: NewUser = {
        ...fields,
        email: createUserDto.email,
      } as NewUser;
      const [user] = await this.db.insert(users).values(newUser).returning();
      return user;
    } else {
      throw new BadRequestException(`Invalid role: ${createUserDto.role}`);
    }
  }

  private generateToken(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user || null;
  }

  async findById(id: number): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user || null;
  }

  async verifyEmail(token: string): Promise<boolean> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.emailVerificationToken, token))
      .limit(1);

    if (
      !user ||
      !user.emailVerificationExpires ||
      user.emailVerificationExpires < new Date()
    ) {
      return false;
    }

    await this.db
      .update(users)
      .set({
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      })
      .where(eq(users.id, user.id));

    return true;
  }

  async verifyOtpCode(email: string, otpCode: string): Promise<boolean> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.otpCode, otpCode)))
      .limit(1);

    if (!user || !user.otpExpires || user.otpExpires < new Date()) {
      return false;
    }

    await this.db
      .update(users)
      .set({
        emailVerified: true,
        otpCode: null,
        otpExpires: null,
      })
      .where(eq(users.id, user.id));

    return true;
  }

  async setPasswordResetToken(email: string): Promise<string | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    const resetToken = this.generateToken();
    const resetExpires = new Date(Date.now() + 3_600_000);

    await this.db
      .update(users)
      .set({
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      })
      .where(eq(users.id, user.id));

    return resetToken;
  }

  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<boolean> {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.passwordResetToken, token))
      .limit(1);

    if (
      !user ||
      !user.passwordResetExpires ||
      user.passwordResetExpires < new Date()
    ) {
      throw new NotFoundException('Invalid or expired password reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.db
      .update(users)
      .set({
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      })
      .where(eq(users.id, user.id));

    return true;
  }
}
