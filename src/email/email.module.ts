import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

// eslint-disable-next-line prettier/prettier
@Module({
  providers: [EmailService],
  exports: [EmailService],
// eslint-disable-next-line prettier/prettier
})
export class EmailModule {}