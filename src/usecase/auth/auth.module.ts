import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../../infrastructure/auth/jwt.strategy';
import { UserRepository } from '../../infrastructure/users/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/users/entities/user.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'temporary_secret_key', // 本番環境では環境変数から取得するべき
      signOptions: { expiresIn: '1h' }, // トークンの有効期限は1時間
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
