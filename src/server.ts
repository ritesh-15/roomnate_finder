import express, { Application, NextFunction, Request, Response } from "express"
import path from "path"
import router from "./routes/routes"
import { config } from "dotenv"
import { engine } from "express-handlebars"
import session from "express-session"
import passport from "passport"
import { passportInit } from "./config/passport"
import morgan from "morgan"
import DatabaseClient from "./config/prisma"
import { cloudinaryConfig } from "./config/cloudinary"
const { PrismaSessionStore } = require("@quixo3/prisma-session-store")
config()

async function main() {
  const app: Application = express()

  const PORT = process.env.PORT || 9000
  const ROOT_PATH = path.resolve()
  const PUBLIC_PATH = path.join(ROOT_PATH, "public")
  const VIEWS_PATH = path.join(ROOT_PATH, "views")

  // database connection
  try {
    await DatabaseClient.get().$connect()
    console.log("Database connection established...")
  } catch (e: any) {
    console.log(e)
    console.log("Database connection error")
    process.exit(1)
  }

  // cloudinary config
  cloudinaryConfig()

  // middleware
  app.use(express.static(PUBLIC_PATH))
  app.use(express.urlencoded({ extended: false }))

  app.use(morgan("dev"))

  app.use(
    session({
      secret: process.env.SESSION_SECRET!!,
      resave: false,
      store: new PrismaSessionStore(DatabaseClient.get(), {
        checkPeriod: 2 * 60 * 1000, //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: process.env.NODE_ENV === "production",
      },
    })
  )

  app.use(passport.initialize())
  app.use(passport.authenticate("session"))
  passportInit(passport)

  // view engine
  app.set("view engine", "handlebars")
  app.engine("handlebars", engine())
  app.set("views", VIEWS_PATH)

  // router
  app.use(router)

  // error handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.render("error")
  })

  app.listen(PORT, () =>
    console.log(`Listening on ${process.env.APP_BASE_URL} 🚀🚀`)
  )

  process.on("SIGINT", async () => {
    await DatabaseClient.get().$disconnect()
    console.log("Connection closed!!!")
  })
}

main()
