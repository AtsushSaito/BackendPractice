import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from '../../usecase/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/users/entities/user.entity';
import { UserRepository } from '../../infrastructure/users/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
