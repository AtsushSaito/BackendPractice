import { DataSource } from 'typeorm';
import { User } from '../domain/users/entities/user.entity';
import { Thread } from '../domain/threads/entities/thread.entity';
import { Post } from '../domain/posts/entities/post.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'threadboard',
  entities: [User, Thread, Post],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
