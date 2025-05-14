import { Repository } from 'typeorm';
import { User } from '../../domain/users/entities/user.entity';
import { IUserRepository } from '../../domain/users/repositories/user.repository.interface';
export declare class UserRepository implements IUserRepository {
    private readonly repository;
    constructor(repository: Repository<User>);
    create(user: Partial<User>): Promise<User>;
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    findByUsername(username: string): Promise<User | null>;
}
