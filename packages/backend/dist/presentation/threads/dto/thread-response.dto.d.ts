declare class UserInfo {
    id: string;
    username: string;
}
export declare class ThreadResponseDto {
    id: string;
    title: string;
    description: string;
    user: UserInfo;
    createdAt: Date;
    updatedAt: Date;
}
export {};
