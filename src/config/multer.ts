import multer from "multer"
import path from "path"
import crypto from "crypto"

const storage = multer.diskStorage({
  destination: (req, file, next) => {
    const filePath = path.join(`${path.resolve()}/public/uploads`)
    return next(null, filePath)
  },
  filename: (req, file, next) => {
    const fileName = `${crypto.randomUUID()}_${Date.now()}${path.extname(
      file.filename
    )}`
    return next(null, fileName)
  },
})

export const upload = multer({ storage })
