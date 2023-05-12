import { NextFunction, Request, Response } from "express"
import { ILoginSchema, IRegisterSchema } from "../validation/user_validation"
import { prisma } from "../config/prisma"
import bcrypt from "bcrypt"

export const postLoginController = async (
  req: Request<{}, {}, ILoginSchema>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user)
      return res.render("user/login", { error: "Invalid username or password" })

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword)
      res.render("user/login", { error: "Invalid username or password" })

    req.login(user, (err: any) => {
      console.log(err)
      throw err
    })

    res.render("user/login")
  } catch (error: any) {
    res.render("user/login")
  }
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
  try {
    const { name, email, password } = req.body

    console.log(req.body)

    const isUserExits = await prisma.user.findUnique({
      where: { email },
    })

    if (isUserExits)
      return res.render("user/register", {
        title: "coLive",
        error: "user with given email already exists!",
      })

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        ...req.body,
        password: hashedPassword,
      },
    })

    req.login(user, (err: any) => {
      console.log(err)
      throw err
    })

    res.render("user/register", { title: "coLive" })
  } catch (err: any) {
    res.render("user/register", { title: "coLive" })
  }
}
