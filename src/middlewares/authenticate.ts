import { NextFunction, Request, Response } from "express"
import { IUser } from "../types"

export function authenticate(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    req.locals = {
      user: req.user as IUser,
      isAuthenticated: true,
    }
    return next()
  }
  return res.redirect("/login")
}
