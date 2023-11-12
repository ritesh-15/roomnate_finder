import { Strategy as LocalStratergy } from "passport-local"
import DatabaseClient from "./prisma"
import bcrypt from "bcrypt"
import { PassportStatic } from "passport"

function passportInit(passport: PassportStatic) {
  passport.use(
    new LocalStratergy(
      { usernameField: "email" },
      async (email, password, cb) => {
        try {
          const user = await DatabaseClient.get().user.findUnique({
            where: { email },
          })

          if (!user)
            return cb(null, false, { message: "Invalid username or password" })

          const isValidPassword = await bcrypt.compare(password, user.password)

          if (!isValidPassword)
            return cb(null, false, { message: "Invalid username or password" })

          return cb(null, user, { message: "Logged in successfully!" })
        } catch (err) {
          return cb(err, false, { message: "Something went wrong!" })
        }
      }
    )
  )

  passport.serializeUser(async (user: any, cb) => {
    cb(null, user.id)
  })

  passport.deserializeUser(async (id: any, cb) => {
    try {
      const user = await DatabaseClient.get().user.findUnique({ where: { id } })
      cb(null, user)
    } catch (e) {
      cb(e, false)
    }
  })
}

export { passportInit }
