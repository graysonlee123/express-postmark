import { MessageSendingResponse } from "postmark/dist/client/models";
import { RestrictedMessage } from "../types";
import { getPostmarkClient } from "./createPostmarkClient";
import { env } from "./env";

type Return = {
  success: boolean
} & ({
  success: false,
  error: unknown,
} | {
  success: true
  data: MessageSendingResponse
})

export async function sendPostmarkEmail(message: RestrictedMessage): Promise<Return> {
  const client = getPostmarkClient()
  const {EMAIL_FROM, EMAIL_TO} = env

  try {
    const response = await client.sendEmail({
      From: EMAIL_FROM,
      To: EMAIL_TO.join(','),
      ...message,
    })

    return {
      success: true,
      data: response,
    }
  } catch (error) {
    return {
      success: false,
      error: error
    }
  }
}
