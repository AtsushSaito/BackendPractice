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
exports.UploadImageResponseDto = exports.UploadImageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UploadImageDto {
    file;
}
exports.UploadImageDto = UploadImageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        format: 'binary',
        description: 'ファイルをアップロード',
    }),
    __metadata("design:type", Object)
], UploadImageDto.prototype, "file", void 0);
class UploadImageResponseDto {
    message;
    location;
}
exports.UploadImageResponseDto = UploadImageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Uploaded to S3!',
        description: 'アップロード成功メッセージ',
    }),
    __metadata("design:type", String)
], UploadImageResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://backendpracticeimages.s3.ap-northeast-1.amazonaws.com/file.jpg',
        description: 'アップロードされたファイルのURL',
    }),
    __metadata("design:type", String)
], UploadImageResponseDto.prototype, "location", void 0);
//# sourceMappingURL=upload-image.dto.js.map