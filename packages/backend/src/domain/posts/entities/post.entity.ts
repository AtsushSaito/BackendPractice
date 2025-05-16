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
import { Thread } from '../../threads/entities/thread.entity';
import { Image } from '../../images/entities/image.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('posts')
export class Post {
  @ApiProperty({
    description: '投稿の一意識別子',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: '投稿内容（HTML形式を含む）',
    example: '<p>これは投稿の内容です。<strong>プログラミング</strong>について議論しましょう。</p>',
  })
  @Column('text')
  content: string;

  @ApiProperty({
    description: '投稿者',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ApiProperty({
    description: '所属するスレッド',
    type: () => Thread,
  })
  @ManyToOne(() => Thread, (thread) => thread.posts)
  thread: Thread;

  @ApiProperty({
    description: '親投稿（返信先）',
    type: () => Post,
    nullable: true,
  })
  @ManyToOne(() => Post, (post) => post.replies, { nullable: true })
  parent?: Post;

  @ApiProperty({
    description: 'この投稿への返信',
    type: [Post],
  })
  @OneToMany(() => Post, (post) => post.parent)
  replies: Post[];

  @ApiProperty({
    description: '投稿に関連する画像',
    type: [Image],
  })
  @OneToMany(() => Image, (image) => image.post, { cascade: true })
  images: Image[];

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
