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
exports.ThreadsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const threads_service_1 = require("../../usecase/threads/threads.service");
const create_thread_dto_1 = require("./dto/create-thread.dto");
const thread_response_dto_1 = require("./dto/thread-response.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let ThreadsController = class ThreadsController {
    threadsService;
    constructor(threadsService) {
        this.threadsService = threadsService;
    }
    async createThread(createThreadDto, user) {
        const threadData = {
            ...createThreadDto,
            userId: user.userId,
        };
        return this.threadsService.createThread(threadData);
    }
    async getAllThreads() {
        return this.threadsService.getAllThreads();
    }
    async getThread(id) {
        return this.threadsService.getThread(id);
    }
};
exports.ThreadsController = ThreadsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '新規スレッドを作成する' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'スレッドが正常に作成されました',
        type: thread_response_dto_1.ThreadResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '認証されていません' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_thread_dto_1.CreateThreadDto, Object]),
    __metadata("design:returntype", Promise)
], ThreadsController.prototype, "createThread", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '全スレッド情報のリストを取得する' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'スレッド情報の一覧を取得しました',
        type: [thread_response_dto_1.ThreadResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThreadsController.prototype, "getAllThreads", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '指定されたIDのスレッド情報を取得する' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'スレッド情報を取得しました',
        type: thread_response_dto_1.ThreadResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThreadsController.prototype, "getThread", null);
exports.ThreadsController = ThreadsController = __decorate([
    (0, swagger_1.ApiTags)('threads'),
    (0, common_1.Controller)('threads'),
    __metadata("design:paramtypes", [threads_service_1.ThreadsService])
], ThreadsController);
//# sourceMappingURL=threads.controller.js.map