import { NextFunction, Request, Response } from "express"
import { prisma } from "../config/prisma"

export async function postSearch(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.redirect(`/search?query=${req.body.query}`)
}

export async function getSearch(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const query = <string>req.query.query || ""

  const conditions: any = [
    {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    {
      location: {
        contains: query,
        mode: "insensitive",
      },
    },
    {
      ammenities: {
        contains: query,
        mode: "insensitive",
      },
    },
    {
      description: {
        contains: query,
        mode: "insensitive",
      },
    },
    {
      rules: {
        contains: query,
        mode: "insensitive",
      },
    },
  ]

  try {
    const roomQuery = prisma.room.findMany({
      where: {
        OR: conditions,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })
    const roommateQuery = prisma.room.findMany({
      where: {
        OR: conditions,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    const [rooms, roommates] = await Promise.all([roomQuery, roommateQuery])

    res.render("search", {
      rooms,
      roommates,
      hasRooms: rooms.length !== 0,
      hasRoommates: roommates.length !== 0,
    })
  } catch (err) {
    console.log(err)
    next(err)
  }
}
