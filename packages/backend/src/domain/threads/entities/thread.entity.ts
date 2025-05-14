import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('threads')
export class Thread {
  @ApiProperty({
    description: 'スレッドの一意識別子',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'スレッドのタイトル',
    example: 'プログラミングについて議論するスレッド',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'スレッドの説明',
    example:
      'このスレッドではプログラミング言語やフレームワークについて議論します。',
  })
  @Column('text')
  description: string;

  @ApiProperty({
    description: 'スレッド作成者',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.threads)
  user: User;

  @ApiProperty({
    description: 'スレッド内の投稿',
    type: [Post],
  })
  @OneToMany(() => Post, (post) => post.thread)
  posts: Post[];

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
