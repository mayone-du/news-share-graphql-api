import fetch from "node-fetch";

import { SLACK_API_ENDPOINT } from "../constants/envs";

export const handleSubmitSlack = async (payload: object) => {
  try {
    if (!SLACK_API_ENDPOINT || !payload) throw Error("invalid");
    await fetch(SLACK_API_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error(error);
  }
};
