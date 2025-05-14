import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Thread } from '../../threads/entities/thread.entity';
import { Post } from '../../posts/entities/post.entity';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'ユーザーの一意識別子',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'ユーザー名',
    example: 'testuser',
  })
  @Column({ unique: true })
  username: string;

  @ApiProperty({
    description: 'メールアドレス',
    example: 'test@example.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiHideProperty()
  @Column()
  password: string;

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

  @ApiProperty({
    description: 'ユーザーが作成したスレッド',
    type: [Thread],
  })
  @OneToMany(() => Thread, (thread) => thread.user)
  threads: Thread[];

  @ApiProperty({
    description: 'ユーザーの投稿',
    type: [Post],
  })
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
