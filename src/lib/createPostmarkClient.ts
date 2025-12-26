import { Client } from 'postmark'

export function createPostmarkClient(token: string): Client {
  return new Client(token)
}
