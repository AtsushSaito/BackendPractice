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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
let PostsService = class PostsService {
    postRepository;
    userRepository;
    threadRepository;
    imageRepository;
    constructor(postRepository, userRepository, threadRepository, imageRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.threadRepository = threadRepository;
        this.imageRepository = imageRepository;
    }
    async createPost(createPostDto) {
        if (!createPostDto.userId) {
            throw new common_1.BadRequestException('User ID is required');
        }
        const user = await this.userRepository.findById(createPostDto.userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const thread = await this.threadRepository.findById(createPostDto.threadId);
        if (!thread) {
            throw new common_1.NotFoundException('Thread not found');
        }
        let parentPost = undefined;
        if (createPostDto.parentId) {
            const foundParent = await this.postRepository.findById(createPostDto.parentId);
            if (!foundParent) {
                throw new common_1.NotFoundException('Parent post not found');
            }
            parentPost = foundParent;
        }
        const post = await this.postRepository.create({
            content: createPostDto.content,
            user: user,
            thread: thread,
            parent: parentPost,
        });
        if (createPostDto.images && createPostDto.images.length > 0) {
            for (let i = 0; i < createPostDto.images.length; i++) {
                const imageDto = createPostDto.images[i];
                await this.imageRepository.create({
                    ...imageDto,
                    postId: post.id,
                    position: imageDto.position || i,
                });
            }
        }
        return this.getPostById(post.id);
    }
    async getPostById(id) {
        const post = await this.postRepository.findById(id);
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        return post;
    }
    async getPostsByThreadId(threadId) {
        const thread = await this.threadRepository.findById(threadId);
        if (!thread) {
            throw new common_1.NotFoundException('Thread not found');
        }
        return this.postRepository.findByThreadId(threadId);
    }
    async getRepliesByPostId(postId) {
        const post = await this.postRepository.findById(postId);
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        return this.postRepository.findByParentId(postId);
    }
    async updatePost(id, updatePostDto) {
        const post = await this.postRepository.findById(id);
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        return this.postRepository.update(id, {
            content: updatePostDto.content,
        });
    }
    async deletePost(id) {
        const post = await this.postRepository.findById(id);
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const images = await this.imageRepository.findByPostId(id);
        for (const image of images) {
            await this.imageRepository.remove(image.id);
        }
        await this.postRepository.delete(id);
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IPostRepository')),
    __param(1, (0, common_1.Inject)('IUserRepository')),
    __param(2, (0, common_1.Inject)('IThreadRepository')),
    __param(3, (0, common_1.Inject)('IImageRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], PostsService);
//# sourceMappingURL=posts.service.js.map