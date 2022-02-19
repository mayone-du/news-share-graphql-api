import dotenv from "dotenv";

dotenv.config();

// production環境
const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID ?? "";
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET ?? "";
const SLACK_REDIRECT_URL = process.env.SLACK_REDIRECT_URL ?? "";
const SLACK_SIGN_IN_SECRET = process.env.SLACK_SIGN_IN_SECRET ?? "";
const SLACK_BOT_OAUTH_TOKEN = process.env.SLACK_BOT_OAUTH_TOKEN ?? "";
// const SLACK_API_ENDPOINT = process.env.SLACK_API_ENDPOINT ?? "";

export const SLACK_ENV_VARS = {
  SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET,
  SLACK_REDIRECT_URL,
  SLACK_SIGN_IN_SECRET,
  SLACK_BOT_OAUTH_TOKEN,
} as const;

// develop環境
const DEV_SLACK_CLIENT_ID = process.env.DEV_SLACK_CLIENT_ID ?? "";
const DEV_SLACK_CLIENT_SECRET = process.env.DEV_SLACK_CLIENT_SECRET ?? "";
const DEV_SLACK_REDIRECT_URL = process.env.DEV_SLACK_REDIRECT_URL ?? "";
const DEV_SLACK_SIGN_IN_SECRET = process.env.DEV_SLACK_SIGN_IN_SECRET ?? "";
const DEV_SLACK_BOT_OAUTH_TOKEN = process.env.DEV_SLACK_BOT_OAUTH_TOKEN ?? "";
// const DEV_SLACK_API_ENDPOINT = process.env.DEV_SLACK_API_ENDPOINT ?? "";

export const DEV_SLACK_ENV_VARS = {
  DEV_SLACK_CLIENT_ID,
  DEV_SLACK_CLIENT_SECRET,
  DEV_SLACK_REDIRECT_URL,
  DEV_SLACK_SIGN_IN_SECRET,
  DEV_SLACK_BOT_OAUTH_TOKEN,
} as const;
