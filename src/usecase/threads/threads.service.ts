import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IThreadRepository } from '../../domain/threads/repositories/thread.repository.interface';
import { IUserRepository } from '../../domain/users/repositories/user.repository.interface';
import { CreateThreadDto } from './dto/create-thread.dto';
import { Thread } from '../../domain/threads/entities/thread.entity';

@Injectable()
export class ThreadsService {
  constructor(
    @Inject('IThreadRepository')
    private readonly threadRepository: IThreadRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async createThread(createThreadDto: CreateThreadDto): Promise<Thread> {
    if (!createThreadDto.userId) {
      throw new BadRequestException('User ID is required');
    }

    const user = await this.userRepository.findById(createThreadDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const thread = await this.threadRepository.create({
      title: createThreadDto.title,
      description: createThreadDto.description,
      user: user,
    });

    return thread;
  }

  async getAllThreads(): Promise<Thread[]> {
    return this.threadRepository.findAll();
  }

  async getThread(id: string): Promise<Thread> {
    const thread = await this.threadRepository.findById(id);
    if (!thread) {
      throw new NotFoundException('Thread not found');
    }
    return thread;
  }
}
