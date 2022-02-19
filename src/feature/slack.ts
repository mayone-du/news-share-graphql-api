import { App as SlackApp } from "@slack/bolt";

import { DEV_SLACK_ENV_VARS } from "../constants/envs";

const slackApp = new SlackApp({
  signingSecret: DEV_SLACK_ENV_VARS.DEV_SLACK_SIGN_IN_SECRET,
  token: DEV_SLACK_ENV_VARS.DEV_SLACK_BOT_OAUTH_TOKEN,
});

export const slackAuthTest = async (token: string) => {
  const authTestResponse = await slackApp.client.auth.test({
    token,
  });
  return authTestResponse;
};

export const getSlackUserStatus = async (token: string, slackUserId: string) => {
  const slackUserStatus = await slackApp.client.users.profile.get({
    token,
    user: slackUserId,
  });
  return slackUserStatus;
};
