"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const users_module_1 = require("./presentation/users/users.module");
const threads_module_1 = require("./presentation/threads/threads.module");
const posts_module_1 = require("./presentation/posts/posts.module");
const auth_module_1 = require("./presentation/auth/auth.module");
const images_module_1 = require("./presentation/images/images.module");
const user_entity_1 = require("./domain/users/entities/user.entity");
const thread_entity_1 = require("./domain/threads/entities/thread.entity");
const post_entity_1 = require("./domain/posts/entities/post.entity");
const image_entity_1 = require("./domain/images/entities/image.entity");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DATABASE_HOST || 'localhost',
                port: parseInt(process.env.DATABASE_PORT || '5432'),
                username: process.env.DATABASE_USERNAME || 'postgres',
                password: process.env.DATABASE_PASSWORD || 'postgres',
                database: process.env.DATABASE_NAME || 'threadboard',
                entities: [user_entity_1.User, thread_entity_1.Thread, post_entity_1.Post, image_entity_1.Image],
                synchronize: process.env.NODE_ENV !== 'production',
            }),
            users_module_1.UsersModule,
            threads_module_1.ThreadsModule,
            posts_module_1.PostsModule,
            auth_module_1.AuthModule,
            images_module_1.ImagesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map