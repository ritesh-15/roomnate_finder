import { v2 as cloudinary } from "cloudinary"
import { config } from "dotenv"
config()

export function cloudinaryConfig() {
  cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUD_NAME,
  })
}
