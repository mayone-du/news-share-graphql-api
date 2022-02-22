import type { News } from "@prisma/client";
import { App as SlackApp } from "@slack/bolt";

import { DEV_SLACK_ENV_VARS } from "../constants/envs";

const slackApp = new SlackApp({
  signingSecret: DEV_SLACK_ENV_VARS.DEV_SLACK_SIGN_IN_SECRET,
  token: DEV_SLACK_ENV_VARS.DEV_SLACK_BOT_OAUTH_TOKEN,
});

// Slack認証情報の検証
export const slackAuthTest = async (token: string) => {
  const authTestResponse = await slackApp.client.auth.test({
    token,
  });
  return authTestResponse;
};

// Slackプロフィールのステータスを取得する
export const getSlackUserStatus = async (token: string, slackUserId: string) => {
  const slackUserStatus = await slackApp.client.users.profile.get({
    token,
    user: slackUserId,
  });
  return slackUserStatus;
};

// Slackにニュースを投稿
export const postNewsListToSlack = async (newsList: News[]) => {
  try {
    const chatPostMessageResponse = await slackApp.client.chat.postMessage({
      channel: "#web-hook",
      blocks: [{ type: "section", text: { type: "plain_text", text: "Hellow" } }], // Slackで今現在障害が起きているので、後日確認
      // blocks: newsList.map((news) => {
      //   return {
      //     type: "section",
      //     text: {
      //       type: "mrkdwn",
      //       text: news.title,
      //       // text: `*<${news.url} | ${news.title}>*\n${news.description}`,
      //     },
      //   };
      // }),
    });
    return chatPostMessageResponse;
  } catch (e) {
    console.error(e);
  }
};
