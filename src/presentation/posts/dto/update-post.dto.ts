import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({ description: '更新する投稿内容' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
