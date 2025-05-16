import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('images')
export class Image {
  @ApiProperty({
    description: '画像の一意識別子',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: '関連する投稿',
    type: () => Post,
  })
  @ManyToOne(() => Post, (post) => post.images)
  post: Post;

  @ApiProperty({
    description: '画像のURL',
    example: 'https://example.com/images/image.jpg',
  })
  @Column('text')
  url: string;

  @ApiProperty({
    description: '画像の元のファイル名',
    example: 'my-image.jpg',
  })
  @Column('text')
  filename: string;

  @ApiProperty({
    description: '画像のMIMEタイプ',
    example: 'image/jpeg',
  })
  @Column('text')
  mimetype: string;

  @ApiProperty({
    description: '画像のサイズ（バイト）',
    example: 1024,
  })
  @Column('integer')
  size: number;

  @ApiProperty({
    description: '投稿内での画像の位置（インデックス）',
    example: 1,
  })
  @Column('integer', { default: 0 })
  position: number;

  @ApiProperty({
    description: '画像の説明（代替テキスト）',
    example: '美しい風景の写真',
    nullable: true,
  })
  @Column('text', { nullable: true })
  alt?: string;

  @ApiProperty({
    description: '作成日時',
    example: '2023-01-01T00:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: '更新日時',
    example: '2023-01-01T00:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
