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
exports.PostsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const posts_service_1 = require("../../usecase/posts/posts.service");
const create_post_dto_1 = require("./dto/create-post.dto");
const update_post_dto_1 = require("./dto/update-post.dto");
const post_response_dto_1 = require("./dto/post-response.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let PostsController = class PostsController {
    postsService;
    constructor(postsService) {
        this.postsService = postsService;
    }
    async createPost(createPostDto, user) {
        const postData = {
            ...createPostDto,
            userId: user.userId,
        };
        return this.postsService.createPost(postData);
    }
    async getPost(id) {
        return this.postsService.getPostById(id);
    }
    async getPostsByThread(threadId) {
        return this.postsService.getPostsByThreadId(threadId);
    }
    async getReplies(id) {
        return this.postsService.getRepliesByPostId(id);
    }
    async updatePost(id, updatePostDto, user) {
        return this.postsService.updatePost(id, updatePostDto);
    }
    async deletePost(id, user) {
        await this.postsService.deletePost(id);
        return { success: true };
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '新規投稿を作成する（返信の場合はparentIdを指定）' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: '投稿が正常に作成されました',
        type: post_response_dto_1.PostResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '認証されていません' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_dto_1.CreatePostDto, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "createPost", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '指定されたIDの投稿情報を取得する' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '投稿情報を取得しました',
        type: post_response_dto_1.PostResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getPost", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'スレッド内の投稿一覧を取得する' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '投稿情報の一覧を取得しました',
        type: [post_response_dto_1.PostResponseDto],
    }),
    __param(0, (0, common_1.Query)('threadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getPostsByThread", null);
__decorate([
    (0, common_1.Get)(':id/replies'),
    (0, swagger_1.ApiOperation)({ summary: '投稿への返信一覧を取得する' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '返信情報の一覧を取得しました',
        type: [post_response_dto_1.PostResponseDto],
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getReplies", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '投稿内容を更新する' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '投稿が正常に更新されました',
        type: post_response_dto_1.PostResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '認証されていません' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_post_dto_1.UpdatePostDto, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "updatePost", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '投稿を削除する' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: '投稿が正常に削除されました' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '認証されていません' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "deletePost", null);
exports.PostsController = PostsController = __decorate([
    (0, swagger_1.ApiTags)('posts'),
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsController);
//# sourceMappingURL=posts.controller.js.map