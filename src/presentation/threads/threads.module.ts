import { Module } from '@nestjs/common';
import { ThreadsController } from './threads.controller';
import { ThreadsService } from '../../usecase/threads/threads.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thread } from '../../domain/threads/entities/thread.entity';
import { ThreadRepository } from '../../infrastructure/threads/thread.repository';
import { User } from '../../domain/users/entities/user.entity';
import { UserRepository } from '../../infrastructure/users/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Thread, User])],
  controllers: [ThreadsController],
  providers: [
    ThreadsService,
    {
      provide: 'IThreadRepository',
      useClass: ThreadRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [ThreadsService],
})
export class ThreadsModule {}
