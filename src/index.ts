require('dotenv').config()

import express from 'express'
import { createPostmarkClient } from './lib/createPostmarkClient'
import { env } from './lib/env'
import sendEmail from './routes/api/email/send'

const { POSTMARK_API_TOKEN, PORT } = env
const app = express()

createPostmarkClient(POSTMARK_API_TOKEN)

app.use(express.json())
app.use('/', sendEmail)

app.listen(PORT, (error) => {
  if (error) {
    console.error(error)

    return
  }

  console.log('Listening on port ' + PORT)
})
