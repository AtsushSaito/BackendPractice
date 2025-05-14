import { Thread } from '../entities/thread.entity';
import { User } from '../../users/entities/user.entity';

export interface IThreadRepository {
  create(thread: Partial<Thread>): Promise<Thread>;
  findById(id: string): Promise<Thread | null>;
  findAll(): Promise<Thread[]>;
}
