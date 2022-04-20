import type { User } from "@prisma/client";

// TODO: 認証方法変えたので考える
export type UserInfo =
  | {
      // 認証成功時
      isAuthenticated: true;
      user: User | null;
      payload: Payload;
    }
  | {
      // 認証失敗時
      isAuthenticated: false;
      error?: Error | unknown;
    };

export type Payload = {
  /** OAuth User ID */
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  auth_time: number;
  nonce: string;
  at_hash: string;
  "https//slack.com/team_id": string;
  "https//slack.com/user_id": string;
  email: string;
  email_verified: boolean;
  date_email_verified: number;
  locale: "ja-JP";
  name: string;
  /** URL */
  picture: string;
  given_name: string;
  family_name: string;
  "https://slack.com/team_name": string;
  "https://slack.com/team_domain": string;
  /** URL */
  "https://slack.com/team_image_230": string;
  "https://slack.com/team_image_default": boolean;
};
