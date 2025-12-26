import { Message } from "postmark"

declare global {
  namespace Express {
    interface Request {
      requestId: string
    }
  }
}

export type ApiResponse = {
  ok: boolean
  message: string
} & ({
  ok: false
  errors: string[]
} | {
  ok: true
})

export type RestrictedMessage = Omit<Message, 'From' | 'To'>