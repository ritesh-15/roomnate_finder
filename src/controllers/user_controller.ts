import { NextFunction, Request, Response } from "express"
import {
  ILoginSchema,
  IRegisterSchema,
  IUpdateProfileScheam,
  LoginSchema,
  RegisterSchema,
  UpdateProfileScheam,
} from "../validation/user_validation"
import DatabaseClient from "../config/prisma"
import bcrypt from "bcrypt"
import { User } from "@prisma/client"
import passport from "passport"
import { v2 as cloudinary } from "cloudinary"
import fs from "fs/promises"

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
  return res.render("user/login")
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
      location: issue.path[0] === "location",
      message: issue.message,
    }))

    return res.render("user/register", { errors, values: req.body })
  }

  try {
    const isUserExits = await DatabaseClient.get().user.findUnique({
      where: { email: data.email },
    })

    if (isUserExits)
      return res.render("user/register", {
        error: "user with given email already exists!",
        values: {
          email: data.email,
          name: data.name,
          location: data.location,
        },
      })

    const hashedPassword = await bcrypt.hash(data.password, 12)

    await DatabaseClient.get().user.create({
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
        location: data.location,
      },
      error: "something went wront while logging you in, please try again! ",
    })
  }
}

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await DatabaseClient.get().user.findUnique({
      where: { id: req.locals.user?.id },
      include: {
        rooms: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    })

    res.render("user/profile", { user })
  } catch (err) {
    next(err)
  }
}

export const getEditProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await DatabaseClient.get().user.findUnique({
      where: {
        id: req.locals.user?.id,
      },
    })

    res.render("user/edit_profile", { user })
  } catch (err) {
    next(err)
  }
}

export const postEditProfile = async (
  req: Request<{}, {}, IUpdateProfileScheam>,
  res: Response,
  next: NextFunction
) => {
  let data: IUpdateProfileScheam | null = null

  try {
    data = await UpdateProfileScheam.parseAsync(req.body)
  } catch (err: any) {
    const errors = err.issues.map((issue: any) => ({
      about: issue.path[0] === "about",
      phone: issue.path[0] === "phone",
      name: issue.path[0] === "name",
      location: issue.path[0] === "location",
      message: issue.message,
    }))

    return res.render("user/edit_profile", { errors, user: req.body })
  }

  try {
    let uploadResult = null

    if (req.file) uploadResult = await cloudinary.uploader.upload(req.file.path)

    const [user] = await Promise.all([
      DatabaseClient.get().user.update({
        where: {
          id: req.locals.user?.id,
        },
        data: {
          ...data,
          image: uploadResult
            ? uploadResult.secure_url
            : req.locals.user?.image,
        },
      }),
      req.file && fs.unlink(req?.file?.path),
    ])

    req.locals.user = user

    res.redirect("/me")
  } catch (err) {
    next(err)
  }
}

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.logOut({}, () => {
      return res.redirect("/login")
    })
  } catch (err) {
    console.log(err)
    next(err)
  }
}
