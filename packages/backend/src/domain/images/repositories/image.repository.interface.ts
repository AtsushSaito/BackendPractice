import { Multer } from 'multer';
import { CreateImageDto } from '../dto/create-image.dto';
import { UpdateImageDto } from '../dto/update-image.dto';
import { Image } from '../entities/image.entity';

export interface IImageRepository {
  // 画像ファイルをアップロードしてURLを取得
  uploadImage(
    file: Express.Multer.File,
  ): Promise<{ location: string; key: string }>;

  // 画像メタデータの保存
  create(createImageDto: CreateImageDto): Promise<Image>;

  // 投稿IDに紐づく画像の取得
  findByPostId(postId: string): Promise<Image[]>;

  // 画像IDによる画像の取得
  findById(id: string): Promise<Image>;

  // 画像の更新
  update(id: string, updateImageDto: UpdateImageDto): Promise<Image>;

  // 画像の削除
  remove(id: string): Promise<void>;
}
