import express, { Application } from "express"
import path from "path"
import router from "./routes/routes"
import { config } from "dotenv"
import { engine } from "express-handlebars"
config()

const app: Application = express()

const PORT = process.env.PORT || 9000
const ROOT_PATH = path.resolve()
const PUBLIC_PATH = path.join(ROOT_PATH, "public")
const VIEWS_PATH = path.join(ROOT_PATH, "src/views")

app.use(express.static(PUBLIC_PATH))
app.set("view engine", "handlebars")
app.engine("handlebars", engine())
app.set("views", VIEWS_PATH)
app.use(router)

app.listen(PORT, () =>
  console.log(`Listening on ${process.env.APP_BASE_URL} 🚀🚀`)
)
