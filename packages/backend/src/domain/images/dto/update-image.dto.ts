import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateImageDto {
  @ApiProperty({
    description: '画像のURL',
    example: 'https://example.com/images/updated-image.jpg',
  })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({
    description: '投稿内での画像の位置（インデックス）',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  position?: number;

  @ApiProperty({
    description: '画像の説明（代替テキスト）',
    example: '更新された風景の写真',
  })
  @IsOptional()
  @IsString()
  alt?: string;
}
