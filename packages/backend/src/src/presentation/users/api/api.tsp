import "@typespec/rest";
import "@typespec/openapi3";

@service({
  title: "User API",
  version: "1.0.0"
})
namespace UserApi;

@doc("ユーザー登録のリクエスト")
model CreateUserRequest {
  @doc("ユーザー名")
  username: string;
  
  @doc("メールアドレス")
  email: string;
  
  @doc("パスワード")
  password: string;
}

@doc("ユーザー情報のレスポンス")
model UserResponse {
  @doc("ユーザーID")
  id: string;
  
  @doc("ユーザー名")
  username: string;
  
  @doc("メールアドレス")
  email: string;
  
  @doc("作成日時")
  createdAt: string;
  
  @doc("更新日時")
  updatedAt: string;
}

@route("/users")
interface Users {
  @post
  @doc("新規ユーザーを登録する")
  createUser(@body user: CreateUserRequest): UserResponse;
  
  @get
  @doc("全ユーザー情報のリストを取得する")
  getAllUsers(): UserResponse[];
  
  @get
  @route("/{id}")
  @doc("指定されたIDのユーザー情報を取得する")
  getUser(@path id: string): UserResponse;
} 