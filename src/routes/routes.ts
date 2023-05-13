import { Router } from "express"
import {
  getEditProfile,
  getLoginController,
  getProfile,
  getRegisterController,
  logoutController,
  postEditProfile,
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
  removeRoomController,
} from "../controllers/room_controller"
import { upload } from "../config/multer"
import {
  getFindRoommate,
  getRoommateDetails,
  getRoommates,
  postFindRoommate,
} from "../controllers/roommate_controller"
import { getSearch, postSearch } from "../controllers/search_controller"

const router: Router = Router()

// rooms
router.route("/").get(authenticate, getRoomController)

// room details
router.route("/room/detail/:id").get(authenticate, getRoomDetailsController)

// remove room
router.route("/remove-room/:id").get(authenticate, removeRoomController)

// create room
router
  .route("/room/create-room")
  .get(authenticate, getCreateRoomController)
  .post(authenticate, upload.single("image"), postCreateRoomController)

// roommates
router.get("/roommates", authenticate, getRoommates)

// find new roommate
router
  .route("/roommate/find-roommate")
  .get(authenticate, getFindRoommate)
  .post(authenticate, postFindRoommate)

// roommate details
router.get("/roommate/detail/:id", authenticate, getRoommateDetails)

router
  .route("/search")
  .get(authenticate, getSearch)
  .post(authenticate, postSearch)

// user profile
router.route("/me").get(authenticate, getProfile)

// user profile
router
  .route("/edit-profile")
  .get(authenticate, getEditProfile)
  .post(authenticate, upload.single("image"), postEditProfile)

// login
router.route("/login").get(guest, getLoginController).post(postLoginController)

router.route("/logout").get(authenticate, logoutController)

// register
router
  .route("/register")
  .get(guest, getRegisterController)
  .post(postRegisterController)

export default router
