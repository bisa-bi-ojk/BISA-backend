import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OtpService } from './services/otp.service';
import { TokenService } from './services/token.service';

@Module({
  imports: [ConfigModule],
  providers: [TokenService, OtpService],
  exports: [TokenService, OtpService],
})
export class CommonModule {}
