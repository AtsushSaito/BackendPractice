import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsArray,
} from 'class-validator';
import { CreateImageDto } from '../../images/dto/create-image.dto';

export class CreatePostDto {
  @ApiProperty({
    description: '投稿内容（HTML形式を含む）',
    example:
      '<p>これは投稿の内容です。<strong>プログラミング</strong>について議論しましょう。</p>',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'スレッドID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  threadId: string;

  @ApiProperty({
    description: 'ユーザーID（内部処理で自動設定）',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    description: '親投稿ID（返信の場合）',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiProperty({
    description: '投稿に関連する画像の配列',
    type: [CreateImageDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  images?: CreateImageDto[];
}
