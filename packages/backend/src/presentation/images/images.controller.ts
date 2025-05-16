import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  UploadImageDto,
  UploadImageResponseDto,
} from '../../usecase/images/dto/upload-image.dto';
import { ImagesService } from '../../usecase/images/images.service';
import { CreateImageDto } from '../../domain/images/dto/create-image.dto';
import { UpdateImageDto } from '../../domain/images/dto/update-image.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Image } from '../../domain/images/entities/image.entity';

@ApiTags('画像')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'ファイルをS3にアップロード' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImageDto })
  @ApiResponse({
    status: 201,
    description: 'ファイルが正常にアップロードされました',
    type: UploadImageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが無効です' })
  @ApiResponse({ status: 500, description: 'サーバーエラー' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadImageResponseDto> {
    return this.imagesService.uploadImage(file);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '画像メタデータの作成' })
  @ApiResponse({
    status: 201,
    description: '画像メタデータが正常に作成されました',
    type: Image,
  })
  async create(@Body() createImageDto: CreateImageDto): Promise<Image> {
    return this.imagesService.create(createImageDto);
  }

  @Get('post/:postId')
  @ApiOperation({ summary: '投稿IDに紐づく画像一覧の取得' })
  @ApiResponse({
    status: 200,
    description: '画像一覧が正常に取得されました',
    type: [Image],
  })
  async findByPostId(@Param('postId') postId: string): Promise<Image[]> {
    return this.imagesService.findByPostId(postId);
  }

  @Get(':id')
  @ApiOperation({ summary: '画像IDによる画像の取得' })
  @ApiResponse({
    status: 200,
    description: '画像が正常に取得されました',
    type: Image,
  })
  async findOne(@Param('id') id: string): Promise<Image> {
    return this.imagesService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '画像の更新' })
  @ApiResponse({
    status: 200,
    description: '画像が正常に更新されました',
    type: Image,
  })
  async update(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
  ): Promise<Image> {
    return this.imagesService.update(id, updateImageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '画像の削除' })
  @ApiResponse({
    status: 200,
    description: '画像が正常に削除されました',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.imagesService.remove(id);
  }
}
