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
exports.Thread = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const post_entity_1 = require("../../posts/entities/post.entity");
const swagger_1 = require("@nestjs/swagger");
let Thread = class Thread {
    id;
    title;
    description;
    user;
    posts;
    createdAt;
    updatedAt;
};
exports.Thread = Thread;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'スレッドの一意識別子',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Thread.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'スレッドのタイトル',
        example: 'プログラミングについて議論するスレッド',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Thread.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'スレッドの説明',
        example: 'このスレッドではプログラミング言語やフレームワークについて議論します。',
    }),
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Thread.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'スレッド作成者',
        type: () => user_entity_1.User,
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.threads),
    __metadata("design:type", user_entity_1.User)
], Thread.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'スレッド内の投稿',
        type: [post_entity_1.Post],
    }),
    (0, typeorm_1.OneToMany)(() => post_entity_1.Post, (post) => post.thread),
    __metadata("design:type", Array)
], Thread.prototype, "posts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '作成日時',
        example: '2023-01-01T00:00:00Z',
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Thread.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '更新日時',
        example: '2023-01-01T00:00:00Z',
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Thread.prototype, "updatedAt", void 0);
exports.Thread = Thread = __decorate([
    (0, typeorm_1.Entity)('threads')
], Thread);
//# sourceMappingURL=thread.entity.js.map