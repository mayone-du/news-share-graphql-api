/* eslint-disable @typescript-eslint/naming-convention */

import type { User } from "@prisma/client";
import type { AuthTestResponse } from "@slack/web-api";

export type UserContext =
  | {
      // 認証成功時
      isAuthenticated: true;
      slackAuthTestResponse: Required<Pick<AuthTestResponse, "user_id">>;
      token: string;
      user: User | null;
    }
  | {
      // 認証失敗時
      isAuthenticated: false;
      error?: Error | unknown;
    };
