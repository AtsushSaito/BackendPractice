import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
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

  @ApiProperty({ description: '作成者のユーザーID', required: false })
  @IsUUID()
  @IsOptional()
  userId?: string;
}
