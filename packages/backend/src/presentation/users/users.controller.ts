import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UsersService } from '../../usecase/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../domain/users/entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '新規ユーザーを登録する' })
  @ApiResponse({
    status: 201,
    description: 'ユーザーが正常に登録されました',
    type: User,
  })
  @ApiResponse({
    status: 409,
    description: '既に同じユーザー名またはメールアドレスが登録されています',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'Username already exists' },
        error: { type: 'string', example: 'Duplicate username' },
        timestamp: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
        path: { type: 'string', example: '/users' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'バリデーションエラー（入力値が不正）',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'username must be a string',
            'email must be an email address',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary:
      'ユーザー情報のリストを取得する（オプションでユーザー名で検索可能）',
  })
  @ApiQuery({
    name: 'username',
    required: false,
    description: 'フィルタリングするユーザー名',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'ユーザー情報の一覧を取得しました',
    type: [User],
  })
  async getAllUsers(@Query('username') username?: string) {
    if (username) {
      const user = await this.usersService.findByUsername(username);
      return user ? [user] : [];
    }
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: '指定されたIDのユーザー情報を取得する' })
  @ApiResponse({
    status: 200,
    description: 'ユーザー情報を取得しました',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: '指定されたIDのユーザーが見つかりません',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }
}
