import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({
    description: '関連する投稿のID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  postId: string;

  @ApiProperty({
    description: '画像のURL',
    example: 'https://example.com/images/image.jpg',
  })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({
    description: '画像の元のファイル名',
    example: 'my-image.jpg',
  })
  @IsNotEmpty()
  @IsString()
  filename: string;

  @ApiProperty({
    description: '画像のMIMEタイプ',
    example: 'image/jpeg',
  })
  @IsNotEmpty()
  @IsString()
  mimetype: string;

  @ApiProperty({
    description: '画像のサイズ（バイト）',
    example: 1024,
  })
  @IsNotEmpty()
  @IsNumber()
  size: number;

  @ApiProperty({
    description: '投稿内での画像の位置（インデックス）',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  position?: number;

  @ApiProperty({
    description: '画像の説明（代替テキスト）',
    example: '美しい風景の写真',
  })
  @IsOptional()
  @IsString()
  alt?: string;
}
