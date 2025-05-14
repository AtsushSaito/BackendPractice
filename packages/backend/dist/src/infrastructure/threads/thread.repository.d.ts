import { Repository } from 'typeorm';
import { Thread } from '../../domain/threads/entities/thread.entity';
import { IThreadRepository } from '../../domain/threads/repositories/thread.repository.interface';
export declare class ThreadRepository implements IThreadRepository {
    private readonly repository;
    constructor(repository: Repository<Thread>);
    create(thread: Partial<Thread>): Promise<Thread>;
    findById(id: string): Promise<Thread | null>;
    findAll(): Promise<Thread[]>;
}
