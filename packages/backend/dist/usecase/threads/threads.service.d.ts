import { IThreadRepository } from '../../domain/threads/repositories/thread.repository.interface';
import { IUserRepository } from '../../domain/users/repositories/user.repository.interface';
import { CreateThreadDto } from './dto/create-thread.dto';
import { Thread } from '../../domain/threads/entities/thread.entity';
export declare class ThreadsService {
    private readonly threadRepository;
    private readonly userRepository;
    constructor(threadRepository: IThreadRepository, userRepository: IUserRepository);
    createThread(createThreadDto: CreateThreadDto): Promise<Thread>;
    getAllThreads(): Promise<Thread[]>;
    getThread(id: string): Promise<Thread>;
}
