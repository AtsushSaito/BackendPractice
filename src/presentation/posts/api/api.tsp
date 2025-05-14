import "@typespec/rest";
import "@typespec/openapi3";

@service({
  title: "Post API",
  version: "1.0.0"
})
namespace PostApi;

@doc("ユーザー情報")
model UserInfo {
  @doc("ユーザーID")
  id: string;
  
  @doc("ユーザー名")
  username: string;
}

@doc("親投稿情報")
model ParentPostInfo {
  @doc("親投稿ID")
  id: string;
  
  @doc("親投稿の内容")
  content: string;
}

@doc("投稿作成のリクエスト")
model CreatePostRequest {
  @doc("投稿内容")
  content: string;
  
  @doc("所属するスレッドのID")
  threadId: string;
  
  @doc("作成者のユーザーID")
  userId: string;
  
  @doc("親投稿のID（返信の場合）")
  parentId?: string;
}

@doc("投稿更新のリクエスト")
model UpdatePostRequest {
  @doc("投稿内容")
  content: string;
}

@doc("投稿情報のレスポンス")
model PostResponse {
  @doc("投稿ID")
  id: string;
  
  @doc("投稿内容")
  content: string;
  
  @doc("所属するスレッドID")
  threadId: string;
  
  @doc("作成者情報")
  user: UserInfo;
  
  @doc("親投稿情報（返信の場合）")
  parent?: ParentPostInfo;
  
  @doc("作成日時")
  createdAt: string;
  
  @doc("更新日時")
  updatedAt: string;
}

@route("/posts")
interface Posts {
  @post
  @doc("新規投稿を作成する")
  createPost(@body post: CreatePostRequest): PostResponse;
  
  @get
  @doc("スレッド内の投稿一覧を取得する")
  getPosts(@query threadId: string): PostResponse[];
  
  @get
  @route("/{id}")
  @doc("指定されたIDの投稿情報を取得する")
  getPost(@path id: string): PostResponse;
  
  @get
  @route("/{id}/replies")
  @doc("投稿への返信一覧を取得する")
  getReplies(@path id: string): PostResponse[];
  
  @put
  @route("/{id}")
  @doc("投稿内容を更新する")
  updatePost(@path id: string, @body post: UpdatePostRequest): PostResponse;
  
  @delete
  @route("/{id}")
  @doc("投稿を削除する")
  deletePost(@path id: string): void;
} 