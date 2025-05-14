import { IUserRepository } from '../../domain/users/repositories/user.repository.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../domain/users/entities/user.entity';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    createUser(createUserDto: CreateUserDto): Promise<User>;
    getUser(id: string): Promise<User>;
    getAllUsers(): Promise<User[]>;
}
