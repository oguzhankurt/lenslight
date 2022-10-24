import express from "express"
import { getAboutPage, getIndexPage, getRegisterPage, getLoginPage, getLogout, getContact, sendMail } from "../controllers/pageController.js"
const router = express.Router()

router.get("/", getIndexPage)
router.get("/about", getAboutPage)
router.get("/register", getRegisterPage)
router.get("/login", getLoginPage)
router.get("/logout", getLogout)
router.get("/contact", getContact)
router.post("/contact", sendMail)

export default router