import { NextFunction, Request, Response } from "express"

export function errors(error: unknown, req: Request, res: Response, next: NextFunction) {
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] ${req.ip} ${req.method} ${req.url}`

  if (error instanceof SyntaxError && 'body' in error) {
    // JSON parse error from express.json()
    console.warn(`${prefix} ${error.name}: ${error.message}`)
    res.status(400).json({ ok: false, message: 'Invalid JSON', errors: [error.message] })
    return
  }

  if (error instanceof Error) {
    console.error(`${prefix} ${error.name}: ${error.message}`)
  } else {
    console.error(`${prefix} An unknown error occurred`, error)
  }

  res.status(500).json({ ok: false, message: 'Internal server error', errors: [] })
}
