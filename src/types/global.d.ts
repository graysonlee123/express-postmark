import { Message } from "postmark"

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