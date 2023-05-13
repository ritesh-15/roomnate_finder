import { NextFunction, Request, Response } from "express"
import {
  FindRoommateSchema,
  IFindRoommateSchema,
} from "../validation/roommate_validation"
import DatabaseClient from "../config/prisma"
import moment from "moment"

export async function getRoommates(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await DatabaseClient.get().roommate.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
      },
    })

    const roommates = data.map((roommate) => ({
      ...roommate,
      createdAt: moment(roommate.createdAt).fromNow(),
    }))

    res.render("home/roommates", {
      rooms: false,
      user: req.user,
      roommates,
    })
  } catch (err) {
    next(err)
  }
}

export async function getFindRoommate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.render("roommate/find_roommate", { user: req.user })
}

export async function postFindRoommate(
  req: Request<{}, {}, IFindRoommateSchema>,
  res: Response,
  next: NextFunction
) {
  let data = null

  try {
    data = await FindRoommateSchema.parseAsync(req.body)
  } catch (err: any) {
    const errors = err.issues.map((issue: any) => ({
      description: issue.path[0] === "description",
      rules: issue.path[0] === "rules",
      rent: issue.path[0] === "rent",
      ammenities: issue.path[0] === "ammenities",
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
    await DatabaseClient.get().roommate.create({
      data: {
        ...data,
        userId: req.locals.user?.id!!,
      },
    })

    res.redirect("/roommates")
  } catch (err) {
    next(err)
  }
}

export async function getRoommateDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await DatabaseClient.get().roommate.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
      },
    })

    if (!data) return next()

    const roommate = {
      ...data,
      createdAt: moment(data.createdAt).fromNow(),
      ammenities: data.ammenities.split(",").map((item) => ({ name: item })),
    }

    res.render("roommate/roommate_detail", {
      user: req.locals.user,
      roommate,
      isOwner: roommate.userId === req.locals.user?.id,
    })
  } catch (err) {
    next(err)
  }
}

export async function removeRoommateController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const room = await DatabaseClient.get().roommate.findUnique({
      where: { id: req.params.id },
    })
    if (!room) return next(new Error("room not found!"))
    if (room.userId !== req.locals.user?.id) return res.redirect("/")
    await DatabaseClient.get().roommate.delete({ where: { id: req.params.id } })
    res.redirect("/")
  } catch (err) {
    next(err)
  }
}
