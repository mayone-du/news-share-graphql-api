/* eslint-disable @typescript-eslint/naming-convention */

import type { User } from "@prisma/client";

type SlackAuthTestSuccessResponse = {
  ok: true;
  url: string;
  team: string;
  team_id: string;
  user: string;
  user_id: string;
  is_enterprise_install: boolean;
};

type SlackAuthTestErrorResponse = {
  ok: false;
  error: string;
};

export type SlackAuthTestResponse = SlackAuthTestSuccessResponse | SlackAuthTestErrorResponse;

export type UserContext =
  | ({
      isAuthenticated: true;
      slackAuthTestResponse: Pick<SlackAuthTestSuccessResponse, "user" | "user_id">;
    } & (
      | {
          isInitialSignIn: true;
        }
      | {
          isInitialSignIn: false;
          user: User;
        }
    ))
  | {
      isAuthenticated: false;
      slackAuthTestResponse: SlackAuthTestErrorResponse;
      error?: Error | unknown;
    };
