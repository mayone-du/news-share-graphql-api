import dotenv from "dotenv";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";
export const isDev = NODE_ENV === "development";
// eslint-disable-next-line no-console
console.log(`NODE_ENV: ${NODE_ENV}`);

const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID ?? "";
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET ?? "";
const SLACK_REDIRECT_URL = process.env.SLACK_REDIRECT_URL ?? "";
const SLACK_SIGN_IN_SECRET = process.env.SLACK_SIGN_IN_SECRET ?? "";
const SLACK_BOT_OAUTH_TOKEN = process.env.SLACK_BOT_OAUTH_TOKEN ?? "";
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID ?? "";

export const SLACK_ENV_VARS = {
  SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET,
  SLACK_REDIRECT_URL,
  SLACK_SIGN_IN_SECRET,
  SLACK_BOT_OAUTH_TOKEN,
  SLACK_CHANNEL_ID,
} as const;
