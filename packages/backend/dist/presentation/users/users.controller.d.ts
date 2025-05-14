import { UsersService } from '../../usecase/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../domain/users/entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(createUserDto: CreateUserDto): Promise<User>;
    getAllUsers(): Promise<User[]>;
    getUser(id: string): Promise<User>;
}
