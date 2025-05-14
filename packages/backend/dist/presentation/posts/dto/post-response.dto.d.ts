declare class UserInfo {
    id: string;
    username: string;
}
declare class ParentPostInfo {
    id: string;
    content: string;
}
export declare class PostResponseDto {
    id: string;
    content: string;
    threadId: string;
    user: UserInfo;
    parent?: ParentPostInfo;
    createdAt: Date;
    updatedAt: Date;
}
export {};
