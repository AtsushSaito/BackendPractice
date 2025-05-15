"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateImagesTable1719720000000 = void 0;
const typeorm_1 = require("typeorm");
class CreateImagesTable1719720000000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
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
        }), true);
        await queryRunner.createForeignKey('images', new typeorm_1.TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('images', new typeorm_1.TableForeignKey({
            columnNames: ['postId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'posts',
            onDelete: 'SET NULL',
        }));
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('images');
        if (table) {
            const userForeignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
            const postForeignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('postId') !== -1);
            if (userForeignKey) {
                await queryRunner.dropForeignKey('images', userForeignKey);
            }
            if (postForeignKey) {
                await queryRunner.dropForeignKey('images', postForeignKey);
            }
        }
        await queryRunner.dropTable('images');
    }
}
exports.CreateImagesTable1719720000000 = CreateImagesTable1719720000000;
//# sourceMappingURL=create-images-table.migration.js.map