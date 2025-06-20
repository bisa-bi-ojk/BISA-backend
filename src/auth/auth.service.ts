import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../database/schema';
import { EmailService } from '../email/email.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRepository } from '../users/user.repository';
import { UsersService } from '../users/users.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    await this.sendVerification(user);
    const { password, ...sanitized } = user;
    return {
      message:
        'User registered successfully. Please check your email for verification.',
      user: sanitized,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepo.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(loginDto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    const { password, ...sanitized } = user;
    return { access_token, user: sanitized };
  }

  async verifyEmail(token: string) {
    const user = await this.userRepo.findByVerificationToken(token);
    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    const wasVerified = await this.usersService.verifyEmail(token);
    if (!wasVerified) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.emailService.sendEmailConfirmation(user.email, user.fullName);

    return { message: 'Email verified successfully' };
  }

  async verifyOtpCode(email: string, otpCode: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid or expired OTP code');
    }

    const wasValid = await this.usersService.verifyOtpCode(email, otpCode);
    if (!wasValid) {
      throw new BadRequestException('Invalid or expired OTP code');
    }

    await this.emailService.sendEmailConfirmation(user.email, user.fullName);

    return { message: 'OTP verified successfully' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userRepo.findByEmail(forgotPasswordDto.email);
    const resetToken = await this.usersService.setPasswordResetToken(
      forgotPasswordDto.email,
    );
    if (resetToken && user) {
      await this.emailService.sendPasswordReset(
        user.email,
        resetToken,
        user.fullName,
      );
    }
    return {
      message: 'If the email exists, a password reset link has been sent',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword, confirmPassword } = resetPasswordDto;
    const user = await this.usersService.resetPassword(
      token,
      newPassword,
      confirmPassword,
    );
    await this.emailService.sendPasswordResetSuccess(user.email, user.fullName);
    return { message: 'Password reset successfully' };
  }

  private async sendVerification(user: User) {
    if (user.emailVerificationToken) {
      await this.emailService.sendEmailVerification(
        user.email,
        user.emailVerificationToken,
        user.fullName,
      );
    } else if (user.otpCode) {
      await this.emailService.sendOtpCode(
        user.email,
        user.otpCode,
        user.fullName,
      );
    }
  }
}
