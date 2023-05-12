import { Router } from "express"
import {
  getLoginController,
  getRegisterController,
  postLoginController,
  postRegisterController,
} from "../controllers/user_controller"

const router: Router = Router()

// rooms
router.get("/", (req, res) => {
  res.render("home/rooms", { title: "CoLive", rooms: true })
})

// roommates
router.get("/roommates", (req, res) => {
  res.render("home/roommates", { title: "CoLive", rooms: false })
})

// room details
router.get("/room/detail/:id", (req, res) => {
  res.render("room/room_detail", { title: "CoLive" })
})

// roommate details
router.get("/roommate/detail/:id", (req, res) => {
  res.render("roommate/roommate_detail", { title: "CoLive" })
})

// user profile
router.get("/me", (req, res) => {
  res.render("user/profile", { title: "CoLive" })
})

// user profile
router.get("/edit-profile", (req, res) => {
  res.render("user/edit_profile", { title: "CoLive" })
})

// create room
router.get("/room/create-room", (req, res) => {
  res.render("room/create", { title: "CoLive" })
})

// find new roommate
router.get("/roommate/find-roommate", (req, res) => {
  res.render("roommate/find_roommate", { title: "CoLive" })
})

// login
router.route("/login").get(getLoginController).post(postLoginController)

// register
router
  .route("/register")
  .get(getRegisterController)
  .post(postRegisterController)

export default router
