# 誕生日を通知してくれるボット

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
