import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ThreadsService } from '../../usecase/threads/threads.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { ThreadResponseDto } from './dto/thread-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('threads')
@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '新規スレッドを作成する' })
  @ApiResponse({
    status: 201,
    description: 'スレッドが正常に作成されました',
    type: ThreadResponseDto,
  })
  @ApiResponse({ status: 401, description: '認証されていません' })
  async createThread(
    @Body() createThreadDto: CreateThreadDto,
    @CurrentUser() user: any,
  ) {
    // ユーザーIDをDTOに設定
    const threadData = {
      ...createThreadDto,
      userId: user.userId,
    };

    return this.threadsService.createThread(threadData);
  }

  @Get()
  @ApiOperation({ summary: '全スレッド情報のリストを取得する' })
  @ApiResponse({
    status: 200,
    description: 'スレッド情報の一覧を取得しました',
    type: [ThreadResponseDto],
  })
  async getAllThreads() {
    return this.threadsService.getAllThreads();
  }

  @Get(':id')
  @ApiOperation({ summary: '指定されたIDのスレッド情報を取得する' })
  @ApiResponse({
    status: 200,
    description: 'スレッド情報を取得しました',
    type: ThreadResponseDto,
  })
  async getThread(@Param('id') id: string) {
    return this.threadsService.getThread(id);
  }
}
