import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../domain/posts/entities/post.entity';
import { IPostRepository } from '../../domain/posts/repositories/post.repository.interface';

@Injectable()
export class PostRepository implements IPostRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
  ) {}

  async create(post: Partial<Post>): Promise<Post> {
    const newPost = this.repository.create(post);
    return this.repository.save(newPost);
  }

  async findById(id: string): Promise<Post | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user', 'thread', 'parent', 'images'],
    });
  }

  async findByThreadId(threadId: string): Promise<Post[]> {
    return this.repository.find({
      where: { thread: { id: threadId } },
      relations: ['user', 'parent', 'images'],
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async findByParentId(parentId: string): Promise<Post[]> {
    return this.repository.find({
      where: { parent: { id: parentId } },
      relations: ['user', 'images'],
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async update(id: string, post: Partial<Post>): Promise<Post> {
    await this.repository.update(id, post);
    const updatedPost = await this.findById(id);
    if (!updatedPost) {
      throw new Error('Post not found');
    }
    return updatedPost;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
