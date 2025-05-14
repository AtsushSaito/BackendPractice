export class CreatePostDto {
  content: string;
  threadId: string;
  userId?: string;
  parentId?: string;
}
