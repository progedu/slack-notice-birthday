# 誕生日を通知してくれるボット
### 使う前のコードの変更
投稿するチャンネルIDと `MM月DD日` 形式の誕生日が設定されているカスタムフィールのIDは `src/index.ts` に直書きされているので利用する際にはフォークして修正のこと。

### 使い方

Node.js の v10.16.3 以上をインストール。コンソールにて

```
$ npm install
$ env SLACK_TOKEN=xoxp-999999999-999999999-999999999-999999999 npm start
```

を実行。 SLACK_TOKEN には、

- users:read
- users.profile:read
- chat:write:bot

のスコープが付いている必要がある。 チャンネルはチャンネル ID をスクリプトに直書いているため、修正する場合には修正のこと。

cronなどで毎朝、

```
node dist/index.js
```

を実行することなどを想定して作られている。
