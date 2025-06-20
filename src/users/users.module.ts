import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { DatabaseModule } from '../database/database.module';
import { UserRepository } from './user.repository';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule, CommonModule],
  providers: [UserRepository, UsersService],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
