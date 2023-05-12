import { NextFunction, Request, Response } from "express"

export function authenticate(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    req.locals = {
      user: req.user,
      isAuthenticated: true,
    }
    return next()
  }
  return res.redirect("/login")
}
