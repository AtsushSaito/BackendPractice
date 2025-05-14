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
exports.ThreadsService = void 0;
const common_1 = require("@nestjs/common");
let ThreadsService = class ThreadsService {
    threadRepository;
    userRepository;
    constructor(threadRepository, userRepository) {
        this.threadRepository = threadRepository;
        this.userRepository = userRepository;
    }
    async createThread(createThreadDto) {
        if (!createThreadDto.userId) {
            throw new common_1.BadRequestException('User ID is required');
        }
        const user = await this.userRepository.findById(createThreadDto.userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const thread = await this.threadRepository.create({
            title: createThreadDto.title,
            description: createThreadDto.description,
            user: user,
        });
        return thread;
    }
    async getAllThreads() {
        return this.threadRepository.findAll();
    }
    async getThread(id) {
        const thread = await this.threadRepository.findById(id);
        if (!thread) {
            throw new common_1.NotFoundException('Thread not found');
        }
        return thread;
    }
};
exports.ThreadsService = ThreadsService;
exports.ThreadsService = ThreadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IThreadRepository')),
    __param(1, (0, common_1.Inject)('IUserRepository')),
    __metadata("design:paramtypes", [Object, Object])
], ThreadsService);
//# sourceMappingURL=threads.service.js.map