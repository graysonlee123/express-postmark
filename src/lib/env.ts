import { z } from "zod";

const schema = z.object({
  POSTMARK_API_TOKEN: z.string().uuid(),
  POSTMARK_TIMEOUT: z.coerce.number().min(1).max(180).default(30),
  EMAIL_FROM: z.string().email(),
  EMAIL_TO: z.string()
    .transform(s => s.split(',').map(e => e.trim()))
    .pipe(z.array(z.string().email()).min(1)),
  PORT: z.coerce.number().min(0).max(65535).default(3000),
})

const env = schema.parse(process.env)

export { env }
