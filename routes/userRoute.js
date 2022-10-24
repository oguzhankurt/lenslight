import express from "express"
import { createUser, loginUser, getDashboard, getAllUser, getAUser, follow, unFollow } from "../controllers/userController.js"
import { authToken } from "../middlewares/authMid.js"
const router = express.Router()

router.post("/register", createUser)
router.post("/login", loginUser)
router.get("/dashboard", authToken, getDashboard)
router.get("/", authToken, getAllUser)
router.get("/:id", authToken, getAUser)
router.put("/:id/follow", authToken, follow)
router.put("/:id/unfollow", authToken, unFollow)

export default router