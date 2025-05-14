import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Unknown error';

    // 既知の例外を処理
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || message;
        error = (exceptionResponse as any).error || error;
      } else {
        message = exceptionResponse.toString();
      }

      // 認証関連のエラーメッセージを改善
      if (exception instanceof UnauthorizedException) {
        error = 'Unauthorized';
        message = 'ログインが必要です。有効な認証トークンを提供してください。';
      } else if (exception instanceof ForbiddenException) {
        error = 'Forbidden';
        message = 'このリソースにアクセスする権限がありません。';
      } else if (exception instanceof NotFoundException) {
        error = 'Not Found';
        // メッセージをより具体的にする
        if (message.includes('Thread')) {
          message = '指定されたスレッドが見つかりません。';
        } else if (message.includes('Post')) {
          message = '指定された投稿が見つかりません。';
        } else if (message.includes('User')) {
          message = '指定されたユーザーが見つかりません。';
        } else {
          message = '指定されたリソースが見つかりません。';
        }
      }
    }
    // JWT関連のエラーを処理
    else if (exception instanceof JsonWebTokenError) {
      status = HttpStatus.UNAUTHORIZED;
      error = 'Invalid Token';
      message = '無効な認証トークンです。再ログインしてください。';
    } else if (exception instanceof TokenExpiredError) {
      status = HttpStatus.UNAUTHORIZED;
      error = 'Token Expired';
      message =
        '認証トークンの有効期限が切れています。再ログインしてください。';
    }
    // TypeORM のユニーク制約違反エラー
    else if (exception instanceof QueryFailedError) {
      const err = exception as any;

      // PostgreSQLのユニーク制約違反エラーコード
      if (err.code === '23505') {
        status = HttpStatus.CONFLICT;

        // エラーの詳細から重複しているフィールドを特定
        const detail = err.detail || '';
        if (detail.includes('username')) {
          message = 'Username already exists';
          error = 'Duplicate username';
        } else if (detail.includes('email')) {
          message = 'Email already exists';
          error = 'Duplicate email';
        } else {
          message = 'Duplicate entry';
          error = 'Unique constraint violation';
        }
      }
    }

    // ログ出力
    console.error(`Exception: ${exception}`);

    // クライアントにレスポンスを返す
    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
