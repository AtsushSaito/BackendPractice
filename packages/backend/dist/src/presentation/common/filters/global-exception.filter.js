"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const jsonwebtoken_1 = require("jsonwebtoken");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'Unknown error';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                message = exceptionResponse.message || message;
                error = exceptionResponse.error || error;
            }
            else {
                message = exceptionResponse.toString();
            }
            if (exception instanceof common_1.UnauthorizedException) {
                error = 'Unauthorized';
                message = 'ログインが必要です。有効な認証トークンを提供してください。';
            }
            else if (exception instanceof common_1.ForbiddenException) {
                error = 'Forbidden';
                message = 'このリソースにアクセスする権限がありません。';
            }
            else if (exception instanceof common_1.NotFoundException) {
                error = 'Not Found';
                if (message.includes('Thread')) {
                    message = '指定されたスレッドが見つかりません。';
                }
                else if (message.includes('Post')) {
                    message = '指定された投稿が見つかりません。';
                }
                else if (message.includes('User')) {
                    message = '指定されたユーザーが見つかりません。';
                }
                else {
                    message = '指定されたリソースが見つかりません。';
                }
            }
        }
        else if (exception instanceof jsonwebtoken_1.JsonWebTokenError) {
            status = common_1.HttpStatus.UNAUTHORIZED;
            error = 'Invalid Token';
            message = '無効な認証トークンです。再ログインしてください。';
        }
        else if (exception instanceof jsonwebtoken_1.TokenExpiredError) {
            status = common_1.HttpStatus.UNAUTHORIZED;
            error = 'Token Expired';
            message =
                '認証トークンの有効期限が切れています。再ログインしてください。';
        }
        else if (exception instanceof typeorm_1.QueryFailedError) {
            const err = exception;
            if (err.code === '23505') {
                status = common_1.HttpStatus.CONFLICT;
                const detail = err.detail || '';
                if (detail.includes('username')) {
                    message = 'Username already exists';
                    error = 'Duplicate username';
                }
                else if (detail.includes('email')) {
                    message = 'Email already exists';
                    error = 'Duplicate email';
                }
                else {
                    message = 'Duplicate entry';
                    error = 'Unique constraint violation';
                }
            }
        }
        console.error(`Exception: ${exception}`);
        response.status(status).json({
            statusCode: status,
            message,
            error,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map