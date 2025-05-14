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
exports.ThreadResponseDto = void 0;
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
class ThreadResponseDto {
    id;
    title;
    description;
    user;
    createdAt;
    updatedAt;
}
exports.ThreadResponseDto = ThreadResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'スレッドID' }),
    __metadata("design:type", String)
], ThreadResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'スレッドのタイトル' }),
    __metadata("design:type", String)
], ThreadResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'スレッドの説明文' }),
    __metadata("design:type", String)
], ThreadResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '作成者情報' }),
    __metadata("design:type", UserInfo)
], ThreadResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '作成日時' }),
    __metadata("design:type", Date)
], ThreadResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '更新日時' }),
    __metadata("design:type", Date)
], ThreadResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=thread-response.dto.js.map