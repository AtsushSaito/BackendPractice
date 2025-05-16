import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'ファイルをアップロード',
  })
  file: any;
}

export class UploadImageResponseDto {
  @ApiProperty({
    example: 'Uploaded to S3!',
    description: 'アップロード成功メッセージ',
  })
  message: string;

  @ApiProperty({
    example:
      'https://backendpracticeimages.s3.ap-northeast-1.amazonaws.com/file.jpg',
    description: 'アップロードされたファイルのURL',
  })
  location: string;
}
