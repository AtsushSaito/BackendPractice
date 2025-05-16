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
exports.Image = void 0;
const typeorm_1 = require("typeorm");
const post_entity_1 = require("../../posts/entities/post.entity");
const swagger_1 = require("@nestjs/swagger");
let Image = class Image {
    id;
    post;
    url;
    filename;
    mimetype;
    size;
    position;
    alt;
    createdAt;
    updatedAt;
};
exports.Image = Image;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '画像の一意識別子',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Image.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '関連する投稿',
        type: () => post_entity_1.Post,
    }),
    (0, typeorm_1.ManyToOne)(() => post_entity_1.Post, (post) => post.images),
    __metadata("design:type", post_entity_1.Post)
], Image.prototype, "post", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '画像のURL',
        example: 'https://example.com/images/image.jpg',
    }),
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Image.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '画像の元のファイル名',
        example: 'my-image.jpg',
    }),
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Image.prototype, "filename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '画像のMIMEタイプ',
        example: 'image/jpeg',
    }),
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Image.prototype, "mimetype", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '画像のサイズ（バイト）',
        example: 1024,
    }),
    (0, typeorm_1.Column)('integer'),
    __metadata("design:type", Number)
], Image.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '投稿内での画像の位置（インデックス）',
        example: 1,
    }),
    (0, typeorm_1.Column)('integer', { default: 0 }),
    __metadata("design:type", Number)
], Image.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '画像の説明（代替テキスト）',
        example: '美しい風景の写真',
        nullable: true,
    }),
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Image.prototype, "alt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '作成日時',
        example: '2023-01-01T00:00:00Z',
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Image.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '更新日時',
        example: '2023-01-01T00:00:00Z',
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Image.prototype, "updatedAt", void 0);
exports.Image = Image = __decorate([
    (0, typeorm_1.Entity)('images')
], Image);
//# sourceMappingURL=image.entity.js.map