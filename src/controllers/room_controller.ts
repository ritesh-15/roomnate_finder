import { NextFunction, Request, Response } from "express"
import {
  CreateRoomSchema,
  ICreateRoomSchema,
} from "../validation/room_validation"
import { prisma } from "../config/prisma"

export function getRoomController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return res.render("home/rooms", { rooms: true, user: req.user })
}

export function getCreateRoomController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.render("room/create", { user: req.user })
}

export async function postCreateRoomController(
  req: Request<{}, {}, ICreateRoomSchema>,
  res: Response,
  next: NextFunction
) {
  let data = null

  try {
    data = await CreateRoomSchema.parseAsync(req.body)
  } catch (err: any) {
    const errors = err.issues.map((issue: any) => ({
      description: issue.path[0] === "description",
      rules: issue.path[0] === "rules",
      rent: issue.path[0] === "rent",
      ammenities: issue.path[0] === "ammenities",
      location: issue.path[0] === "location",
      image: issue.path[0] === "image",
      name: issue.path[0] === "name",
      message: issue.message,
    }))
    return res.render("room/create", {
      errors,
      user: req.user,
      values: req.body,
    })
  }

  try {
    await prisma.room.create({
      data: {
        ...data,
        image: req.file?.filename!!,
      },
    })

    res.redirect("/")
  } catch (e) {
    res.render("room/create", {
      user: req.user,
      error: "Something went wrong!",
    })
  }
}

export function getRoomDetailsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.render("room/room_detail", { user: req.user })
}
