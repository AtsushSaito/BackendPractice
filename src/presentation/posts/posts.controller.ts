import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PostsService } from '../../usecase/posts/posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '新規投稿を作成する' })
  @ApiResponse({
    status: 201,
    description: '投稿が正常に作成されました',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 401, description: '認証されていません' })
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: any,
  ) {
    createPostDto.userId = user.userId;
    return this.postsService.createPost(createPostDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '指定されたIDの投稿情報を取得する' })
  @ApiResponse({
    status: 200,
    description: '投稿情報を取得しました',
    type: PostResponseDto,
  })
  async getPost(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Get()
  @ApiOperation({ summary: 'スレッド内の投稿一覧を取得する' })
  @ApiResponse({
    status: 200,
    description: '投稿情報の一覧を取得しました',
    type: [PostResponseDto],
  })
  async getPostsByThread(@Query('threadId') threadId: string) {
    return this.postsService.getPostsByThreadId(threadId);
  }

  @Get(':id/replies')
  @ApiOperation({ summary: '投稿への返信一覧を取得する' })
  @ApiResponse({
    status: 200,
    description: '返信情報の一覧を取得しました',
    type: [PostResponseDto],
  })
  async getReplies(@Param('id') id: string) {
    return this.postsService.getRepliesByPostId(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '投稿内容を更新する' })
  @ApiResponse({
    status: 200,
    description: '投稿が正常に更新されました',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 401, description: '認証されていません' })
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: any,
  ) {
    return this.postsService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '投稿を削除する' })
  @ApiResponse({ status: 204, description: '投稿が正常に削除されました' })
  @ApiResponse({ status: 401, description: '認証されていません' })
  async deletePost(@Param('id') id: string, @CurrentUser() user: any) {
    await this.postsService.deletePost(id);
    return { success: true };
  }
}
