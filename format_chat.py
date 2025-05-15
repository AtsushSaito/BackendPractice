import json, sys, os
from datetime import datetime

# JSONデータを読み込む
try:
    with open("extracted_chat_histories/raw_chat_f0e56b70.json", "r") as f:
        data = json.load(f)
except json.JSONDecodeError:
    print("JSONの解析に失敗しました。")
    sys.exit(1)

# チャット履歴を整形して新しいファイルに保存
formatted_data = []
for item in data:
    if "type" in item and item["type"] == "chat":
        chat_item = {}
        # タイムスタンプをわかりやすい形式に変換
        if "unixMs" in item:
            timestamp = datetime.fromtimestamp(item["unixMs"] / 1000)
            chat_item["timestamp"] = timestamp.strftime("%Y-%m-%d %H:%M:%S")
        
        # チャットの内容を抽出
        if "textDescription" in item:
            chat_item["description"] = item["textDescription"]
        
        # ユーザーのメッセージを抽出
        if "promptDetails" in item and "prompt" in item["promptDetails"]:
            chat_item["user_message"] = item["promptDetails"]["prompt"]
        
        # AIの応答を抽出
        if "generatedContent" in item:
            chat_item["ai_response"] = item["generatedContent"]
        
        formatted_data.append(chat_item)

# 整形されたデータをJSON形式で保存
with open("extracted_chat_histories/formatted_chat_f0e56b70.json", "w") as f:
    json.dump(formatted_data, f, indent=2, ensure_ascii=False)

print(f"整形されたチャット履歴を formatted_chat_f0e56b70.json に保存しました。")

# チャット履歴をテキスト形式でも保存
with open("extracted_chat_histories/chat_history_f0e56b70.md", "w") as f:
    f.write("# Google Search App - チャット履歴\n\n")
    for i, item in enumerate(formatted_data, 1):
        f.write(f"## チャット {i}\n")
        f.write(f"日時: {item.get('timestamp', 'N/A')}\n\n")
        
        if "description" in item:
            f.write(f"概要: {item['description']}\n\n")
        
        if "user_message" in item:
            f.write("### ユーザーメッセージ\n")
            f.write(f"```\n{item['user_message']}\n```\n\n")
        
        if "ai_response" in item:
            f.write("### AI応答\n")
            f.write(f"```\n{item['ai_response']}\n```\n\n")
        
        f.write("---\n\n")

print(f"チャット履歴をマークダウン形式でも chat_history_f0e56b70.md に保存しました。") 