import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

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
