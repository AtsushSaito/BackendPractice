"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const AWS = require("aws-sdk");
const uuid_1 = require("uuid");
const image_entity_1 = require("../../domain/images/entities/image.entity");
const post_entity_1 = require("../../domain/posts/entities/post.entity");
let ImageRepository = class ImageRepository {
    imageRepository;
    postRepository;
    s3;
    bucketName = 'backendpracticeimages';
    constructor(imageRepository, postRepository) {
        this.imageRepository = imageRepository;
        this.postRepository = postRepository;
        this.s3 = new AWS.S3({
            region: 'ap-northeast-1',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }
    async uploadImage(file) {
        const key = `${(0, uuid_1.v4)()}-${file.originalname}`;
        const uploadResult = await this.s3
            .upload({
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        })
            .promise();
        return {
            location: uploadResult.Location,
            key: uploadResult.Key,
        };
    }
    async create(createImageDto) {
        const post = await this.postRepository.findOne({
            where: { id: createImageDto.postId },
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${createImageDto.postId} not found`);
        }
        const image = this.imageRepository.create({
            ...createImageDto,
            post,
        });
        return this.imageRepository.save(image);
    }
    async findByPostId(postId) {
        return this.imageRepository.find({
            where: { post: { id: postId } },
            order: { position: 'ASC' },
        });
    }
    async findById(id) {
        const image = await this.imageRepository.findOne({ where: { id } });
        if (!image) {
            throw new common_1.NotFoundException(`Image with ID ${id} not found`);
        }
        return image;
    }
    async update(id, updateImageDto) {
        const image = await this.findById(id);
        if (updateImageDto.url !== undefined) {
            image.url = updateImageDto.url;
        }
        if (updateImageDto.position !== undefined) {
            image.position = updateImageDto.position;
        }
        if (updateImageDto.alt !== undefined) {
            image.alt = updateImageDto.alt;
        }
        return this.imageRepository.save(image);
    }
    async remove(id) {
        const image = await this.findById(id);
        const key = image.url.split('/').pop();
        if (key) {
            await this.s3
                .deleteObject({
                Bucket: this.bucketName,
                Key: key,
            })
                .promise();
        }
        await this.imageRepository.remove(image);
    }
};
exports.ImageRepository = ImageRepository;
exports.ImageRepository = ImageRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(image_entity_1.Image)),
    __param(1, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ImageRepository);
//# sourceMappingURL=image.repository.js.map