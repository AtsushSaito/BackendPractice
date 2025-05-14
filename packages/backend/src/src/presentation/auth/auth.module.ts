import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthModule as AuthUsecaseModule } from '../../usecase/auth/auth.module';

@Module({
  imports: [AuthUsecaseModule],
  controllers: [AuthController],
})
export class AuthModule {}
