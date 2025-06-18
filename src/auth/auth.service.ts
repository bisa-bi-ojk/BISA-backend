import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    // Send verification email
    if (user.emailVerificationToken) {
      await this.emailService.sendEmailVerification(
        user.email,
        user.emailVerificationToken,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return {
      message:
        'User registered successfully. Please check your email for verification.',
      user: result,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    const payload = { email: user.email, sub: user.id };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: result,
    };
  }

  async verifyEmail(token: string) {
    const isVerified = await this.usersService.verifyEmail(token);
    if (!isVerified) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    return { message: 'Email verified successfully' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const resetToken = await this.usersService.setPasswordResetToken(
      forgotPasswordDto.email,
    );

    if (resetToken) {
      await this.emailService.sendPasswordReset(
        forgotPasswordDto.email,
        resetToken,
      );
    }

    // Always return success message for security
    return {
      message: 'If the email exists, a password reset link has been sent',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const isReset = await this.usersService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
      resetPasswordDto.confirmPassword,
    );

    if (!isReset) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    return { message: 'Password reset successfully' };
  }
}
