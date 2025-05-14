import { ApiProperty } from '@nestjs/swagger';

class UserInfo {
  @ApiProperty({ description: 'ユーザーID' })
  id: string;

  @ApiProperty({ description: 'ユーザー名' })
  username: string;
}

class ParentPostInfo {
  @ApiProperty({ description: '親投稿ID' })
  id: string;

  @ApiProperty({ description: '親投稿の内容（一部）' })
  content: string;
}

export class PostResponseDto {
  @ApiProperty({ description: '投稿ID' })
  id: string;

  @ApiProperty({ description: '投稿内容' })
  content: string;

  @ApiProperty({ description: '所属するスレッドID' })
  threadId: string;

  @ApiProperty({ description: '作成者情報' })
  user: UserInfo;

  @ApiProperty({ description: '親投稿情報（返信の場合）', required: false })
  parent?: ParentPostInfo;

  @ApiProperty({ description: '作成日時' })
  createdAt: Date;

  @ApiProperty({ description: '更新日時' })
  updatedAt: Date;
}
