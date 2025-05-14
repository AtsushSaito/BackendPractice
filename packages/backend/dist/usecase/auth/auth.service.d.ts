import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../../domain/users/repositories/user.repository.interface';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User } from '../../domain/users/entities/user.entity';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: IUserRepository, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<User | null>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    getAuthenticatedUser(userId: string): Promise<User>;
}
