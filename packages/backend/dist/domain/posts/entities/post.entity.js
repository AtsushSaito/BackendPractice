"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const thread_entity_1 = require("../../threads/entities/thread.entity");
const swagger_1 = require("@nestjs/swagger");
let Post = class Post {
    id;
    content;
    user;
    thread;
    parent;
    replies;
    createdAt;
    updatedAt;
};
exports.Post = Post;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '投稿の一意識別子',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Post.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '投稿内容',
        example: 'これは投稿の内容です。プログラミングについて議論しましょう。',
    }),
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '投稿者',
        type: () => user_entity_1.User,
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.posts),
    __metadata("design:type", user_entity_1.User)
], Post.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '所属するスレッド',
        type: () => thread_entity_1.Thread,
    }),
    (0, typeorm_1.ManyToOne)(() => thread_entity_1.Thread, (thread) => thread.posts),
    __metadata("design:type", thread_entity_1.Thread)
], Post.prototype, "thread", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '親投稿（返信先）',
        type: () => Post,
        nullable: true,
    }),
    (0, typeorm_1.ManyToOne)(() => Post, (post) => post.replies, { nullable: true }),
    __metadata("design:type", Post)
], Post.prototype, "parent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'この投稿への返信',
        type: [Post],
    }),
    (0, typeorm_1.OneToMany)(() => Post, (post) => post.parent),
    __metadata("design:type", Array)
], Post.prototype, "replies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '作成日時',
        example: '2023-01-01T00:00:00Z',
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Post.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '更新日時',
        example: '2023-01-01T00:00:00Z',
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Post.prototype, "updatedAt", void 0);
exports.Post = Post = __decorate([
    (0, typeorm_1.Entity)('posts')
], Post);
//# sourceMappingURL=post.entity.js.map