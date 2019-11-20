import moment from 'moment';
// WebAPI Method について → https://api.slack.com/methods
// Slack SDK WebAPI について → https://slack.dev/node-slack-sdk/web-api
import { WebClient } from '@slack/web-api';
import {
  UsersListResponse,
  UsersProfileGetResponse,
  ChatPostMessageResponse
} from 'seratch-slack-types/web-api';

const sleep = (msec: number) =>
  new Promise(resolve => setTimeout(resolve, msec));

interface CustomFields {
  XfPXCSNNQ6: { value: string }; // 誕生日のカスタムフィールドのキーのID
}

const channel = 'C48P4EST1'; // 投稿チャンネルID形式 (#雑談)

(async () => {
  try {
    const token = process.env.SLACK_TOKEN;
    if (!token) {
      console.log(`[ERROR] 環境変数 SLACK_TOKEN が設定されていません。`);
      return;
    }
    const web = new WebClient(token);
    const usersListResponse = (await web.users.list()) as UsersListResponse;

    if (!usersListResponse.members) {
      console.log(`[ERROR] membersがありませんでした。`);
      return;
    }

    const todayBornMembers = [];
    const members = usersListResponse.members;

    let counter = 1;
    for (const member of members) {
      await sleep(20);
      console.log(
        `[INFO] ${counter++}人目/${members.length}人中 id: ${member.id} name: ${
          member.name
        } を調査します。`
      );
      const usersProfileGetResponse = (await web.users.profile.get({
        user: member.id
      })) as UsersProfileGetResponse;

      if (!usersProfileGetResponse.profile) {
        // console.log(`[INFO] profileがありませんでした。 id: ${member.id} name: ${member.name}`);
        continue;
      }

      if (!usersProfileGetResponse.profile.fields) {
        // console.log(`[INFO] fieldsがありませんでした。 id: ${member.id} name: ${member.name}`);
        continue;
      }

      const birthDayField = (usersProfileGetResponse.profile
        .fields as CustomFields).XfPXCSNNQ6;

      if (!birthDayField) {
        // console.log(`[INFO] birthDayFieldがありませんでした。 id: ${member.id} name: ${member.name}`);
        continue;
      }

      const birthDay = moment(birthDayField.value, 'MM月DD日').toDate();
      const today = new Date();
      console.log(
        `[INFO] id: ${member.id} name: ${member.name} は ${birthDayField.value} が誕生日。`
      );

      if (
        birthDay.getMonth() == today.getMonth() &&
        birthDay.getDate() == today.getDate()
      ) {
        console.log(
          `[INFO] id: ${member.id} name: ${member.name} は今日が誕生日でした！！`
        );
        todayBornMembers.push(member);
      }
    }

    if (todayBornMembers.length > 0) {
      let text =
        ':birthday: 本日は誕生日おめでとうございます！:birthday:\n' +
        todayBornMembers.map(e => e.real_name).join('さん\n') +
        'さん\n:tada::tada::tada::tada::tada::tada::tada::tada::tada::tada:';
      const chatPostMessageResponse = (await web.chat.postMessage({
        channel: channel,
        text: text,
        link_names: true,
        unfurl_links: true,
        unfurl_media: true
      })) as ChatPostMessageResponse;
      console.log(`[INFO] 誕生日のお祝いの投稿が完了しました。`);
    } else {
      console.log(`[INFO] todayBornMembersがありませんでした。`);
    }
  } catch (err) {
    console.log(`[ERROR] エラーが発生しました。 err:`);
    console.log(err);
  }
})();
