import { Client } from 'postmark'

export function createPostmarkClient(token: string, timeout?: number): Client {
  return new Client(token, { timeout })
}
