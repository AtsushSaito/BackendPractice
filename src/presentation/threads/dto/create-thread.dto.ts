import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateThreadDto {
  @ApiProperty({ description: 'スレッドのタイトル' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'スレッドの説明文' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
