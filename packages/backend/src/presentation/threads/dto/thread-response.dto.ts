import { ApiProperty } from '@nestjs/swagger';

class UserInfo {
  @ApiProperty({ description: 'ユーザーID' })
  id: string;

  @ApiProperty({ description: 'ユーザー名' })
  username: string;
}

export class ThreadResponseDto {
  @ApiProperty({ description: 'スレッドID' })
  id: string;

  @ApiProperty({ description: 'スレッドのタイトル' })
  title: string;

  @ApiProperty({ description: 'スレッドの説明文' })
  description: string;

  @ApiProperty({ description: '作成者情報' })
  user: UserInfo;

  @ApiProperty({ description: '作成日時' })
  createdAt: Date;

  @ApiProperty({ description: '更新日時' })
  updatedAt: Date;
}
