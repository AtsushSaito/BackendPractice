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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("../../domain/posts/entities/post.entity");
let PostRepository = class PostRepository {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(post) {
        const newPost = this.repository.create(post);
        return this.repository.save(newPost);
    }
    async findById(id) {
        return this.repository.findOne({
            where: { id },
            relations: ['user', 'thread', 'parent', 'images'],
        });
    }
    async findByThreadId(threadId) {
        return this.repository.find({
            where: { thread: { id: threadId } },
            relations: ['user', 'parent', 'images'],
            order: {
                createdAt: 'ASC',
            },
        });
    }
    async findByParentId(parentId) {
        return this.repository.find({
            where: { parent: { id: parentId } },
            relations: ['user', 'images'],
            order: {
                createdAt: 'ASC',
            },
        });
    }
    async update(id, post) {
        await this.repository.update(id, post);
        const updatedPost = await this.findById(id);
        if (!updatedPost) {
            throw new Error('Post not found');
        }
        return updatedPost;
    }
    async delete(id) {
        await this.repository.delete(id);
    }
};
exports.PostRepository = PostRepository;
exports.PostRepository = PostRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PostRepository);
//# sourceMappingURL=post.repository.js.map