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
exports.CreateImageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateImageDto {
    postId;
    url;
    filename;
    mimetype;
    size;
    position;
    alt;
}
exports.CreateImageDto = CreateImageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '関連する投稿のID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImageDto.prototype, "postId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '画像のURL',
        example: 'https://example.com/images/image.jpg',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImageDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '画像の元のファイル名',
        example: 'my-image.jpg',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImageDto.prototype, "filename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '画像のMIMEタイプ',
        example: 'image/jpeg',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImageDto.prototype, "mimetype", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '画像のサイズ（バイト）',
        example: 1024,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateImageDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '投稿内での画像の位置（インデックス）',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateImageDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '画像の説明（代替テキスト）',
        example: '美しい風景の写真',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImageDto.prototype, "alt", void 0);
//# sourceMappingURL=create-image.dto.js.map