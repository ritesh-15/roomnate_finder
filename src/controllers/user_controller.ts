import { NextFunction, Request, Response } from "express"
import {
  ILoginSchema,
  IRegisterSchema,
  LoginSchema,
  RegisterSchema,
} from "../validation/user_validation"
import { prisma } from "../config/prisma"
import bcrypt from "bcrypt"
import { ZodError } from "zod"
import { User } from "@prisma/client"
import passport from "passport"

export const postLoginController = async (
  req: Request<{}, {}, ILoginSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body = await LoginSchema.parseAsync(req.body)
  } catch (err: any) {
    const errors = err.issues.map((issue: any) => ({
      email: issue.path[0] === "email",
      password: issue.path[0] === "password",
      message: issue.message,
    }))
    return res.render("user/login", { errors, values: req.body })
  }

  passport.authenticate("local", (e: any, user: User, info: any) => {
    if (e)
      return res.render("user/login", { error: info.message, values: req.body })

    if (!user)
      return res.render("user/login", { error: info.message, values: req.body })

    req.logIn(user, (e) => {
      if (e)
        return res.render("user/login", {
          error: info.message,
          values: req.body,
        })

      return res.redirect("/")
    })
  })(req, res, next)
}

export const getLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.render("user/login", { title: "CoLive" })
}

export const getRegisterController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.render("user/register", { title: "CoLive" })
}

export const postRegisterController = async (
  req: Request<{}, {}, IRegisterSchema>,
  res: Response,
  next: NextFunction
) => {
  let data: IRegisterSchema | null = null

  try {
    data = await RegisterSchema.parseAsync(req.body)
  } catch (err: any) {
    const errors = err.issues.map((issue: any) => ({
      email: issue.path[0] === "email",
      password: issue.path[0] === "password",
      name: issue.path[0] === "name",
      message: issue.message,
    }))

    return res.render("user/register", { errors, values: req.body })
  }

  try {
    const isUserExits = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (isUserExits)
      return res.render("user/register", {
        error: "user with given email already exists!",
        values: {
          email: data.email,
          name: data.name,
        },
      })

    const hashedPassword = await bcrypt.hash(data.password, 12)

    await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    })

    res.redirect("/login")
  } catch (err: any) {
    res.render("user/register", {
      title: "coLive",
      values: {
        email: data.email,
        name: data.name,
      },
      error: "something went wront while logging you in, please try again! ",
    })
  }
}
