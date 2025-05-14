import { ThreadsService } from '../../usecase/threads/threads.service';
import { CreateThreadDto } from './dto/create-thread.dto';
export declare class ThreadsController {
    private readonly threadsService;
    constructor(threadsService: ThreadsService);
    createThread(createThreadDto: CreateThreadDto, user: any): Promise<import("../../domain/threads/entities/thread.entity").Thread>;
    getAllThreads(): Promise<import("../../domain/threads/entities/thread.entity").Thread[]>;
    getThread(id: string): Promise<import("../../domain/threads/entities/thread.entity").Thread>;
}
