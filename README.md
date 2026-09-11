# README

User
 ├─ has_many :posts
 ├─ has_many :likes
 ├─ has_many :matches_as_user1, class_name: "Match", foreign_key: :user1_id
 ├─ has_many :matches_as_user2, class_name: "Match", foreign_key: :user2_id
 ├─ has_many :notifications
 └─ has_many :chats, foreign_key: :sender_id

Post
 ├─ belongs_to :user
 ├─ has_many :likes
 ├─ has_one_attached :video
 └─ (optional) belongs_to :store

Like
 ├─ belongs_to :user
 └─ belongs_to :post

Match
 ├─ belongs_to :user1, class_name: "User"
 └─ belongs_to :user2, class_name: "User"
    └─ has_many :chats

Notification
 └─ belongs_to :user

Chat
 ├─ belongs_to :match
 └─ belongs_to :sender, class_name: "User"

Store (optional)
 └─ has_many :posts

Group (optional)
 ├─ has_many :users
 └─ has_many :posts

Report (optional)
 ├─ belongs_to :user
 └─ belongs_to :post


## モデル構成

### User
ユーザー情報を管理するモデル。投稿・いいね・マッチング・通知・チャット送信者として利用される。

### Post
ユーザーが投稿する10秒動画と位置情報を管理するモデル。

### Like
ユーザーが投稿に対して「いいね」するための中間テーブル。相互いいねでマッチングが成立する。

### Match
2人のユーザーが相互いいねした際に作成されるマッチング情報。チャット機能の親モデルとなる。

### Notification（任意）
いいね・マッチなどの通知を管理する軽量モデル。

### Chat（任意）
マッチしたユーザー同士のメッセージを管理するモデル。

### Store（任意）
飲んでいる店名を扱いたい場合に利用するモデル。

### Group（任意）
複数人飲みのグループ管理に利用するモデル。

### Report（任意）
不適切な投稿を通報するためのモデル。
