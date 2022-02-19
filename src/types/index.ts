/* eslint-disable @typescript-eslint/naming-convention */

import type { User } from "@prisma/client";
import type { AuthTestResponse } from "@slack/web-api";

export type UserContext =
  | ({
      isAuthenticated: true;
      slackAuthTestResponse: Required<Pick<AuthTestResponse, "user_id">>;
      token: string;
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
      error?: Error | unknown;
    };
