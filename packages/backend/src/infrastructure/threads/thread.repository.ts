import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Thread } from '../../domain/threads/entities/thread.entity';
import { IThreadRepository } from '../../domain/threads/repositories/thread.repository.interface';

@Injectable()
export class ThreadRepository implements IThreadRepository {
  constructor(
    @InjectRepository(Thread)
    private readonly repository: Repository<Thread>,
  ) {}

  async create(thread: Partial<Thread>): Promise<Thread> {
    const newThread = this.repository.create(thread);
    return this.repository.save(newThread);
  }

  async findById(id: string): Promise<Thread | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findAll(): Promise<Thread[]> {
    return this.repository.find({
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
