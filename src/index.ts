require('dotenv').config()

import express from 'express'
import { createPostmarkClient } from './lib/createPostmarkClient'
import { env } from './lib/env'
import { errors } from './middleware/errors'
import { logger } from './middleware/logger'
import sendEmail from './routes/api/email/send'

const { POSTMARK_API_TOKEN, PORT } = env

createPostmarkClient(POSTMARK_API_TOKEN)

const app = express()

app.use(express.json())
app.use(logger)
app.use('/', sendEmail)
app.use(errors)

app.listen(PORT, (error) => {
  if (error) {
    console.error(error)

    return
  }

  console.log('Listening on port ' + PORT)
})
