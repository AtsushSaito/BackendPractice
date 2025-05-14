"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const posts_controller_1 = require("./posts.controller");
const posts_service_1 = require("../../usecase/posts/posts.service");
const post_entity_1 = require("../../domain/posts/entities/post.entity");
const thread_entity_1 = require("../../domain/threads/entities/thread.entity");
const user_entity_1 = require("../../domain/users/entities/user.entity");
const post_repository_1 = require("../../infrastructure/posts/post.repository");
const thread_repository_1 = require("../../infrastructure/threads/thread.repository");
const user_repository_1 = require("../../infrastructure/users/user.repository");
let PostsModule = class PostsModule {
};
exports.PostsModule = PostsModule;
exports.PostsModule = PostsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([post_entity_1.Post, thread_entity_1.Thread, user_entity_1.User])],
        controllers: [posts_controller_1.PostsController],
        providers: [
            posts_service_1.PostsService,
            {
                provide: 'IPostRepository',
                useClass: post_repository_1.PostRepository,
            },
            {
                provide: 'IThreadRepository',
                useClass: thread_repository_1.ThreadRepository,
            },
            {
                provide: 'IUserRepository',
                useClass: user_repository_1.UserRepository,
            },
        ],
        exports: [posts_service_1.PostsService],
    })
], PostsModule);
//# sourceMappingURL=posts.module.js.map