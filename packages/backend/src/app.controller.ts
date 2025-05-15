import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'ヘルスチェックAPI' })
  @ApiResponse({ status: 200, description: 'サーバーが正常に動作しています' })
  getHello(): string {
    return this.appService.getHello();
  }
}
