import express, { Request, Response } from "express";
import { PostmarkError } from "postmark/dist/client/errors/Errors";
import { sendPostmarkEmail } from "../../../lib/sendPostmarkEmail";
import { RequestBodySchema } from "../../../schemas/RequestBodySchema";
import { ApiResponse } from "../../../types/global";

const router = express.Router()

router.post('/', async (req: Request, res: Response<ApiResponse>) => {
  const parser = RequestBodySchema.safeParse(req.body)

  if (!parser.success) {
    console.warn('Invalid request body:', parser.error.errors)

    res.status(400).json({
      ok: false,
      message: 'Invalid request body.',
      errors: parser.error.errors.map((error) => `body.${error.path}: ${error.message} [${error.code}]`)
    })

    return
  }

  const { subject, html, text } = parser.data

  const result = await sendPostmarkEmail({
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

  res.json({
    ok: true,
    message: 'Email sent!',
  })
})

export default router
