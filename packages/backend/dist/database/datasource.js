"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../domain/users/entities/user.entity");
const thread_entity_1 = require("../domain/threads/entities/thread.entity");
const post_entity_1 = require("../domain/posts/entities/post.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'threadboard',
    entities: [user_entity_1.User, thread_entity_1.Thread, post_entity_1.Post],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: false,
});
//# sourceMappingURL=datasource.js.map