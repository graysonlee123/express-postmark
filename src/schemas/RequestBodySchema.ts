import { z } from "zod";

export const RequestBodySchema = z.object({
  subject: z.string(),
  html: z.string(),
  text: z.string(),
})
