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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("../../usecase/users/users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const user_entity_1 = require("../../domain/users/entities/user.entity");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async createUser(createUserDto) {
        return this.usersService.createUser(createUserDto);
    }
    async getAllUsers() {
        return this.usersService.getAllUsers();
    }
    async getUser(id) {
        return this.usersService.getUser(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '新規ユーザーを登録する' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'ユーザーが正常に登録されました',
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: '既に同じユーザー名またはメールアドレスが登録されています',
        schema: {
            properties: {
                statusCode: { type: 'number', example: 409 },
                message: { type: 'string', example: 'Username already exists' },
                error: { type: 'string', example: 'Duplicate username' },
                timestamp: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
                path: { type: 'string', example: '/users' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'バリデーションエラー（入力値が不正）',
        schema: {
            properties: {
                statusCode: { type: 'number', example: 400 },
                message: {
                    type: 'array',
                    items: { type: 'string' },
                    example: [
                        'username must be a string',
                        'email must be an email address',
                    ],
                },
                error: { type: 'string', example: 'Bad Request' },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '全ユーザー情報のリストを取得する' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'ユーザー情報の一覧を取得しました',
        type: [user_entity_1.User],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '指定されたIDのユーザー情報を取得する' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'ユーザー情報を取得しました',
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: '指定されたIDのユーザーが見つかりません',
        schema: {
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: { type: 'string', example: 'User not found' },
                error: { type: 'string', example: 'Not Found' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUser", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map