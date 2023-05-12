import { Router } from "express"
import {
  getLoginController,
  getRegisterController,
  postLoginController,
  postRegisterController,
} from "../controllers/user_controller"
import { guest } from "../middlewares/guest"
import { authenticate } from "../middlewares/authenticate"
import {
  getCreateRoomController,
  getRoomController,
  getRoomDetailsController,
  postCreateRoomController,
} from "../controllers/room_controller"
import { upload } from "../config/multer"

const router: Router = Router()

// rooms
router.route("/").get(authenticate, getRoomController)

// room details
router.route("/room/detail/:id").get(authenticate, getRoomDetailsController)

// create room
router
  .route("/room/create-room")
  .get(authenticate, getCreateRoomController)
  .post(authenticate, upload.single("image"), postCreateRoomController)

// roommates
router.get("/roommates", authenticate, (req, res) => {
  res.render("home/roommates", {
    title: "CoLive",
    rooms: false,
    user: req.user,
  })
})

// roommate details
router.get("/roommate/detail/:id", authenticate, (req, res) => {
  res.render("roommate/roommate_detail", { title: "CoLive", user: req.user })
})

// user profile
router.get("/me", authenticate, (req, res) => {
  res.render("user/profile", { title: "CoLive", user: req.user })
})

// user profile
router.get("/edit-profile", authenticate, (req, res) => {
  res.render("user/edit_profile", { title: "CoLive", user: req.user })
})

// find new roommate
router.get("/roommate/find-roommate", authenticate, (req, res) => {
  res.render("roommate/find_roommate", { title: "CoLive", user: req.user })
})

// login
router.route("/login").get(guest, getLoginController).post(postLoginController)

// register
router
  .route("/register")
  .get(guest, getRegisterController)
  .post(postRegisterController)

export default router
