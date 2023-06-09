import { NextFunction, Request, Response } from "express"
import {
  CreateRoomSchema,
  ICreateRoomSchema,
  IUpdateRoomSchema,
  UpdateRoomSchema,
} from "../validation/room_validation"
import DatabaseClient from "../config/prisma"
import moment from "moment"
import { v2 as cloudinary } from "cloudinary"
import fs from "fs/promises"

export async function getRoomController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await DatabaseClient.get().room.findMany({
      include: {
        owner: {
          select: {
            id: true,
            image: true,
            name: true,
          },
        },
      },
    })

    const roomsData = data.map((room) => ({
      ...room,
      createdAt: moment(room.createdAt).fromNow(),
    }))

    return res.render("home/rooms", { rooms: true, user: req.user, roomsData })
  } catch (err) {
    next(err)
  }
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
    if (!req.file)
      return res.render("room/create", {
        error: "please choose image to continue",
        values: req.body,
        user: req.user,
      })

    const uploadResult = await cloudinary.uploader.upload(req.file.path)

    await Promise.all([
      DatabaseClient.get().room.create({
        data: {
          ...data,
          image: uploadResult.secure_url,
          userId: (<any>req.user).id,
        },
      }),
      fs.unlink(req.file.path),
    ])

    res.redirect("/")
  } catch (e) {
    next(e)
  }
}

export async function getRoomDetailsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const room = await DatabaseClient.get().room.findUnique({
      where: { id: req.params.id },
      include: {
        owner: {
          select: {
            id: true,
            image: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    if (!room) return next()

    const data = {
      ...room,
      createdAt: moment(room.createdAt).fromNow(),
      ammenities: room.ammenities.split(",").map((item) => ({ name: item })),
    }

    return res.render("room/room_detail", {
      user: req.user,
      room: data,
      isOwner: req.locals.user?.id === data.owner?.id,
    })
  } catch (err: any) {
    next(err)
  }
}

export async function removeRoomController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const room = await DatabaseClient.get().room.findUnique({
      where: { id: req.params.id },
    })
    if (!room) return next(new Error("room not found!"))
    if (room.userId !== req.locals.user?.id) return res.redirect("/")
    await DatabaseClient.get().room.delete({ where: { id: req.params.id } })
    res.redirect("/")
  } catch (err) {
    next(err)
  }
}

export async function getUpdateRoom(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const room = await DatabaseClient.get().room.findUnique({
      where: { id: req.params.id },
    })

    if (!room) throw new Error("room not found")

    if (room.userId !== req.locals.user?.id) return res.redirect("/")

    res.render("room/update_room", { room })
  } catch (err) {
    next(err)
  }
}

export async function postUpdateRoom(
  req: Request<{ id: string }, {}, IUpdateRoomSchema>,
  res: Response,
  next: NextFunction
) {
  let data = null
  let room = null

  try {
    room = await DatabaseClient.get().room.findUnique({
      where: {
        id: req.params.id,
      },
    })

    if (!room) return next()

    data = await UpdateRoomSchema.parseAsync(req.body)
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
    return res.render("room/update_room", {
      errors,
      room: {
        ...req.body,
        image: room?.image,
      },
    })
  }

  try {
    let uploadResult = null

    if (req.file) uploadResult = await cloudinary.uploader.upload(req.file.path)

    await Promise.all([
      DatabaseClient.get().room.update({
        where: {
          id: req.params.id,
        },
        data: {
          ...data,
          image: uploadResult ? uploadResult.secure_url : room.image,
        },
      }),
      req.file && fs.unlink(req.file.path),
    ])

    res.redirect(`/room/detail/${room.id}`)
  } catch (err) {
    next(err)
  }
}
