import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: '投稿内容' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '所属するスレッドのID' })
  @IsUUID()
  @IsNotEmpty()
  threadId: string;

  @ApiProperty({ description: '作成者のユーザーID' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: '親投稿のID（返信の場合）', required: false })
  @IsUUID()
  @IsOptional()
  parentId?: string;
}
