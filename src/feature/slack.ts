import type { News } from "@prisma/client";
import { App as SlackApp } from "@slack/bolt";

import { SLACK_ENV_VARS } from "../constants/envs";

const slackApp = new SlackApp({
  signingSecret: SLACK_ENV_VARS.SLACK_SIGN_IN_SECRET,
  token: SLACK_ENV_VARS.SLACK_BOT_OAUTH_TOKEN,
});

// Slack認証情報の検証
export const slackAuthTest = async (token: string) => {
  const authTestResponse = await slackApp.client.auth.test({ token });
  return authTestResponse;
};

// Slackプロフィールのステータスを取得する
export const getSlackUserStatus = async (slackUserId: string) => {
  const slackUserStatus = await slackApp.client.users.profile.get({
    token: SLACK_ENV_VARS.SLACK_BOT_OAUTH_TOKEN,
    user: slackUserId,
  });
  return slackUserStatus;
};

// Slackにニュースを投稿
export const postNewsListToSlack = async (newsList: News[]) => {
  try {
    const chatPostMessageResponse = await slackApp.client.chat.postMessage({
      channel: SLACK_ENV_VARS.SLACK_CHANNEL_ID,
      blocks: newsList.length
        ? newsList.map((news) => {
            return {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*<${news.url} | ${news.title}>*\n${news.description}`,
              },
              accessory: {
                type: "image",
                image_url: news.imageUrl || "https://via.placeholder.com/150", // TODO: fallback用画像の準備
                alt_text: news.title,
              },
            };
          })
        : [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "本日のニュースシェアはありません",
              },
            },
          ],
    });
    return chatPostMessageResponse;
  } catch (e) {
    console.error(e);
  }
};
