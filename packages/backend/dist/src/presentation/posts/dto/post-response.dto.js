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
exports.PostResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UserInfo {
    id;
    username;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ユーザーID' }),
    __metadata("design:type", String)
], UserInfo.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ユーザー名' }),
    __metadata("design:type", String)
], UserInfo.prototype, "username", void 0);
class ParentPostInfo {
    id;
    content;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: '親投稿ID' }),
    __metadata("design:type", String)
], ParentPostInfo.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '親投稿の内容（一部）' }),
    __metadata("design:type", String)
], ParentPostInfo.prototype, "content", void 0);
class PostResponseDto {
    id;
    content;
    threadId;
    user;
    parent;
    createdAt;
    updatedAt;
}
exports.PostResponseDto = PostResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '投稿ID' }),
    __metadata("design:type", String)
], PostResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '投稿内容' }),
    __metadata("design:type", String)
], PostResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '所属するスレッドID' }),
    __metadata("design:type", String)
], PostResponseDto.prototype, "threadId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '作成者情報' }),
    __metadata("design:type", UserInfo)
], PostResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '親投稿情報（返信の場合）', required: false }),
    __metadata("design:type", ParentPostInfo)
], PostResponseDto.prototype, "parent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '作成日時' }),
    __metadata("design:type", Date)
], PostResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '更新日時' }),
    __metadata("design:type", Date)
], PostResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=post-response.dto.js.map