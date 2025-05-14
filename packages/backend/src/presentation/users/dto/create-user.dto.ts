import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'ユーザー名' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'メールアドレス' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'パスワード' })
  @IsString()
  @MinLength(8)
  password: string;
}
