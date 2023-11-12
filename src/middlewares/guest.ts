import { NextFunction, Request, Response } from "express"

export function guest(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return res.redirect("/")

  return next()
}
