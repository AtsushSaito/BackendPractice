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
exports.ImagesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const upload_image_dto_1 = require("../../usecase/images/dto/upload-image.dto");
const images_service_1 = require("../../usecase/images/images.service");
const create_image_dto_1 = require("../../domain/images/dto/create-image.dto");
const update_image_dto_1 = require("../../domain/images/dto/update-image.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const image_entity_1 = require("../../domain/images/entities/image.entity");
let ImagesController = class ImagesController {
    imagesService;
    constructor(imagesService) {
        this.imagesService = imagesService;
    }
    async uploadFile(file) {
        return this.imagesService.uploadImage(file);
    }
    async create(createImageDto) {
        return this.imagesService.create(createImageDto);
    }
    async findByPostId(postId) {
        return this.imagesService.findByPostId(postId);
    }
    async findOne(id) {
        return this.imagesService.findById(id);
    }
    async update(id, updateImageDto) {
        return this.imagesService.update(id, updateImageDto);
    }
    async remove(id) {
        return this.imagesService.remove(id);
    }
};
exports.ImagesController = ImagesController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiOperation)({ summary: 'ファイルをS3にアップロード' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({ type: upload_image_dto_1.UploadImageDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'ファイルが正常にアップロードされました',
        type: upload_image_dto_1.UploadImageResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'リクエストが無効です' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'サーバーエラー' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '画像メタデータの作成' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: '画像メタデータが正常に作成されました',
        type: image_entity_1.Image,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_image_dto_1.CreateImageDto]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('post/:postId'),
    (0, swagger_1.ApiOperation)({ summary: '投稿IDに紐づく画像一覧の取得' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '画像一覧が正常に取得されました',
        type: [image_entity_1.Image],
    }),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "findByPostId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '画像IDによる画像の取得' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '画像が正常に取得されました',
        type: image_entity_1.Image,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '画像の更新' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '画像が正常に更新されました',
        type: image_entity_1.Image,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_image_dto_1.UpdateImageDto]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '画像の削除' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '画像が正常に削除されました',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "remove", null);
exports.ImagesController = ImagesController = __decorate([
    (0, swagger_1.ApiTags)('画像'),
    (0, common_1.Controller)('images'),
    __metadata("design:paramtypes", [images_service_1.ImagesService])
], ImagesController);
//# sourceMappingURL=images.controller.js.map