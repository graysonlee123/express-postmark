import { randomUUID } from 'crypto'
import { NextFunction, Request, Response } from 'express'

export function logger(req: Request, res: Response, next: NextFunction) {
  req.requestId = randomUUID()
  console.log(`[${new Date().toISOString()}] [${req.requestId}] ${req.ip} ${req.method} ${req.url}`)

  next()
}
