require('dotenv').config()

import express, { Request, Response } from 'express'
import { PostmarkError } from 'postmark/dist/client/errors/Errors'
import { createPostmarkClient } from './lib/createPostmarkClient'
import { env } from './lib/env'
import { sendPostmarkEmail } from './lib/sendPostmarkEmail'
import { errors } from './middleware/errors'
import { logger } from './middleware/logger'
import { RequestBodySchema } from './schemas/RequestBodySchema'
import { ApiResponse } from './types'

const { POSTMARK_API_TOKEN, POSTMARK_TIMEOUT, PORT } = env

const postmarkClient = createPostmarkClient(POSTMARK_API_TOKEN, POSTMARK_TIMEOUT)

const app = express()

app.use(express.json())
app.use(logger)

app.post('/', async (req: Request, res: Response<ApiResponse>) => {
  const parser = RequestBodySchema.safeParse(req.body)

  if (!parser.success) {
    console.warn(`[${new Date().toISOString()}] [${req.requestId}] Invalid request body ${JSON.stringify(parser.error.errors)}`)

    res.status(400).json({
      ok: false,
      message: 'Invalid request body.',
      errors: parser.error.errors.map((error) => `body.${error.path}: ${error.message} [${error.code}]`)
    })

    return
  }

  const { subject, html, text } = parser.data

  const result = await sendPostmarkEmail(postmarkClient, {
    Subject: subject,
    HtmlBody: html,
    TextBody: text,
  })

  if (!result.success) {
    const errorDetail = result.error instanceof PostmarkError
      ? `${result.error.message} [${result.error.code}] [${result.error.statusCode}]`
      : 'Unknown error.'

    console.error(`[${new Date().toISOString()}] [${req.requestId}] Postmark error: ${errorDetail}`)

    res.status(400).json({
      ok: false,
      message: 'Postmark error.',
      errors: [errorDetail],
    })

    return
  }

  console.log(`[${new Date().toISOString()}] [${req.requestId}] Sent email [${result.data.MessageID}] to [${result.data.To}]`)

  res.json({
    ok: true,
    message: 'Email sent!',
  })
})

app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Healthy' })
})

app.use((req, res) => {
  res.status(404).json({ ok: false, message: 'Not found', errors: [] })
})

app.use(errors)

const server = app.listen(PORT, (error) => {
  if (error) {
    console.error(error)

    return
  }

  console.log('Listening on port ' + PORT)
})

const shutdown = () => {
  console.log('Shutting down gracefully...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
