import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../../domain/users/repositories/user.repository.interface';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User } from '../../domain/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    // ユーザー名でユーザーを検索
    const user = await this.userRepository.findByUsername(username);
    
    // ユーザーが存在しない場合はnullを返す
    if (!user) {
      return null;
    }
    
    // パスワードを比較
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    // パスワードが有効な場合はユーザーオブジェクトを返す
    if (isPasswordValid) {
      return user;
    }
    
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // ユーザーを検証
    const user = await this.validateUser(loginDto.username, loginDto.password);
    
    // ユーザーが存在しないか、パスワードが無効な場合はエラー
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // JWTペイロードを作成
    const payload = {
      username: user.username,
      sub: user.id, // subはJWTの標準クレームで、通常ユーザーIDに使用される
    };
    
    // JWTトークンを生成
    const accessToken = this.jwtService.sign(payload);
    
    // レスポンスを返す
    return {
      accessToken,
    };
  }

  async getAuthenticatedUser(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    // パスワードを除外してユーザー情報を返す
    const { password, ...result } = user;
    return result as User;
  }
} 