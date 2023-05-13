import { User } from "@prisma/client"

export interface IUser {
  id: string
  name: string
  email: string
  password: string
  image: string | null
  createdAt: Date
  updatedAt: Date
}

declare global {
  namespace Express {
    interface Request {
      locals: {
        user: IUser | null
        isAuthenticated: boolean
      }
      user: IUser | null
    }
  }
}
