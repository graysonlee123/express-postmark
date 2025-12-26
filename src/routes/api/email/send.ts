import express, { Request, Response } from "express";
import { Client } from "postmark";
import { PostmarkError } from "postmark/dist/client/errors/Errors";
import { sendPostmarkEmail } from "../../../lib/sendPostmarkEmail";
import { RequestBodySchema } from "../../../schemas/RequestBodySchema";
import { ApiResponse } from "../../../types";

export function createSendEmailRouter(client: Client) {
  const router = express.Router()

  router.post('/', async (req: Request, res: Response<ApiResponse>) => {
    const parser = RequestBodySchema.safeParse(req.body)

    if (!parser.success) {
      console.warn(`[${new Date().toISOString()}]: Invalid request body ${JSON.stringify(parser.error.errors)}`)

      res.status(400).json({
        ok: false,
        message: 'Invalid request body.',
        errors: parser.error.errors.map((error) => `body.${error.path}: ${error.message} [${error.code}]`)
      })

      return
    }

    const { subject, html, text } = parser.data

    const result = await sendPostmarkEmail(client, {
      Subject: subject,
      HtmlBody: html,
      TextBody: text,
    })

    if (!result.success) {
      res.status(400).json({
        ok: false,
        message: 'Postmark error.',
        errors: [result.error instanceof PostmarkError ? `${result.error.message} [${result.error.code}] [${result.error.statusCode}]` : 'Unknown error.'],
      })

      return
    }

    console.log(`[${new Date().toISOString()}] Sent postmark email [${result.data.MessageID}] to [${result.data.To}]`)

    res.json({
      ok: true,
      message: 'Email sent!',
    })
  })

  return router
}
