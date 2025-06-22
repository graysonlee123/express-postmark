import { Client } from 'postmark'

class PostmarkClientSingleton {
  private static instance: Client | null = null
  private static token: string | null = null

  static initialize(token: string) {
    if (!this.token) {
      this.token = token
      this.instance = new Client(token)
    }
  }

  static getInstance(): Client {
    if (!this.instance) {
      throw new Error('Postmark client not initialized. Call initialize() first.')
    }

    return this.instance
  }
}

export function createPostmarkClient(token: string) {
  return PostmarkClientSingleton.initialize(token)
}

export function getPostmarkClient() {
  return PostmarkClientSingleton.getInstance()
}