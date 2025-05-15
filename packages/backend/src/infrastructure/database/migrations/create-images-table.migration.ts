import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateImagesTable1719720000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 画像テーブルの作成
    await queryRunner.createTable(
      new Table({
        name: 'images',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'originalFilename',
            type: 'varchar',
          },
          {
            name: 'storedFilename',
            type: 'varchar',
          },
          {
            name: 'mimeType',
            type: 'varchar',
          },
          {
            name: 'size',
            type: 'int',
          },
          {
            name: 'url',
            type: 'varchar',
          },
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'postId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // 外部キー制約の作成
    await queryRunner.createForeignKey(
      'images',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'images',
      new TableForeignKey({
        columnNames: ['postId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'posts',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 外部キー制約の削除
    const table = await queryRunner.getTable('images');

    if (table) {
      const userForeignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('userId') !== -1,
      );
      const postForeignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('postId') !== -1,
      );

      if (userForeignKey) {
        await queryRunner.dropForeignKey('images', userForeignKey);
      }

      if (postForeignKey) {
        await queryRunner.dropForeignKey('images', postForeignKey);
      }
    }

    // テーブルの削除
    await queryRunner.dropTable('images');
  }
}
