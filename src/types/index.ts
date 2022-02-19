/* eslint-disable @typescript-eslint/naming-convention */

import type { User } from "@prisma/client";
import type { AuthTestResponse } from "@slack/web-api";

export type UserContext =
  | ({
      isAuthenticated: true;
      slackAuthTestResponse: Pick<AuthTestResponse, "user" | "user_id">;
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

// & (
//       | {
//           hasBearerToken: true;
//           slackAuthTestResponse: SlackAuthTestErrorResponse;
//         }
//       | {
//           hasBearerToken: false;
//         }
//     )
