import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthService } from '../../usecase/auth/auth.service';
import { LoginDto } from '../../usecase/auth/dto/login.dto';
import { AuthResponseDto } from '../../usecase/auth/dto/auth-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../../domain/users/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'ユーザー認証を行う' })
  @ApiResponse({
    status: 200,
    description: '認証成功、JWTトークンを返す',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: '認証失敗' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '認証されたユーザーの情報を取得する' })
  @ApiResponse({
    status: 200,
    description: 'ユーザー情報を取得',
    schema: {
      allOf: [
        { $ref: getSchemaPath(User) },
        {
          properties: {
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            username: { type: 'string', example: 'testuser' },
            email: { type: 'string', example: 'test@example.com' },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z',
            },
          },
          // パスワードフィールドは除外
          required: ['id', 'username', 'email'],
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: '認証されていない' })
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getAuthenticatedUser(user.userId);
  }
}
