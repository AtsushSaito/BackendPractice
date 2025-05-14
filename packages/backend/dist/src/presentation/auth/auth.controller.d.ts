import { AuthService } from '../../usecase/auth/auth.service';
import { LoginDto } from '../../usecase/auth/dto/login.dto';
import { AuthResponseDto } from '../../usecase/auth/dto/auth-response.dto';
import { User } from '../../domain/users/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    getProfile(user: any): Promise<User>;
}
