import { NextFunction, Request, Response } from "express"

export function errors(error: unknown, req: Request, res: Response, next: NextFunction) {
  if (error instanceof Error) {
    console.log(`[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.url} ${error.name}: ${error.message}`)
  } else {
    console.error(`[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.url} An unknown error occurred`, error)
  }

  res.status(400).end()
}
