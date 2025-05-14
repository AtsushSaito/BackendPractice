"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadsModule = void 0;
const common_1 = require("@nestjs/common");
const threads_controller_1 = require("./threads.controller");
const threads_service_1 = require("../../usecase/threads/threads.service");
const typeorm_1 = require("@nestjs/typeorm");
const thread_entity_1 = require("../../domain/threads/entities/thread.entity");
const thread_repository_1 = require("../../infrastructure/threads/thread.repository");
const user_entity_1 = require("../../domain/users/entities/user.entity");
const user_repository_1 = require("../../infrastructure/users/user.repository");
let ThreadsModule = class ThreadsModule {
};
exports.ThreadsModule = ThreadsModule;
exports.ThreadsModule = ThreadsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([thread_entity_1.Thread, user_entity_1.User])],
        controllers: [threads_controller_1.ThreadsController],
        providers: [
            threads_service_1.ThreadsService,
            {
                provide: 'IThreadRepository',
                useClass: thread_repository_1.ThreadRepository,
            },
            {
                provide: 'IUserRepository',
                useClass: user_repository_1.UserRepository,
            },
        ],
        exports: [threads_service_1.ThreadsService],
    })
], ThreadsModule);
//# sourceMappingURL=threads.module.js.map