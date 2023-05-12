import express, { Application } from "express"
import path from "path"
import router from "./routes/routes"
import { config } from "dotenv"
import { engine } from "express-handlebars"
import session from "express-session"
import passport from "passport"
config()

const app: Application = express()

const PORT = process.env.PORT || 9000
const ROOT_PATH = path.resolve()
const PUBLIC_PATH = path.join(ROOT_PATH, "public")
const VIEWS_PATH = path.join(ROOT_PATH, "src/views")

// middleware
app.use(express.static(PUBLIC_PATH))
app.use(express.urlencoded({ extended: false }))

app.use(
  session({
    secret: process.env.SESSION_SECRET!!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
)

app.use(passport.authenticate("session"))

// view engine
app.set("view engine", "handlebars")
app.engine("handlebars", engine())
app.set("views", VIEWS_PATH)

// router
app.use(router)

app.listen(PORT, () =>
  console.log(`Listening on ${process.env.APP_BASE_URL} 🚀🚀`)
)
