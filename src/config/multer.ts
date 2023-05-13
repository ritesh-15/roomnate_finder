import multer from "multer"
import path from "path"
import crypto from "crypto"
import fs from "fs"

const storage = multer.diskStorage({
  destination: (req, file, next) => {
    const filePath = path.join(path.resolve(), "public", "uploads")
    if (!fs.existsSync(filePath)) fs.mkdirSync(filePath)
    return next(null, filePath)
  },
  filename: (req, file, next) => {
    const fileName = `${crypto.randomUUID()}_${Date.now()}${path.extname(
      file.originalname
    )}`
    return next(null, fileName)
  },
})

export const upload = multer({ storage })
