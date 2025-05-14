import "@typespec/rest";
import "@typespec/openapi3";

@service({
  title: "Thread API",
  version: "1.0.0"
})
namespace ThreadApi;

@doc("スレッド作成のリクエスト")
model CreateThreadRequest {
  @doc("スレッドのタイトル")
  title: string;
  
  @doc("スレッドの説明文")
  description: string;
  
  @doc("作成者のユーザーID")
  userId: string;
}

@doc("ユーザー情報")
model UserInfo {
  @doc("ユーザーID")
  id: string;
  
  @doc("ユーザー名")
  username: string;
}

@doc("スレッド情報のレスポンス")
model ThreadResponse {
  @doc("スレッドID")
  id: string;
  
  @doc("スレッドのタイトル")
  title: string;
  
  @doc("スレッドの説明文")
  description: string;
  
  @doc("作成者情報")
  user: UserInfo;
  
  @doc("作成日時")
  createdAt: string;
  
  @doc("更新日時")
  updatedAt: string;
}

@route("/threads")
interface Threads {
  @post
  @doc("新規スレッドを作成する")
  createThread(@body thread: CreateThreadRequest): ThreadResponse;
  
  @get
  @doc("全スレッド情報のリストを取得する")
  getAllThreads(): ThreadResponse[];
  
  @get
  @route("/{id}")
  @doc("指定されたIDのスレッド情報を取得する")
  getThread(@path id: string): ThreadResponse;
} 