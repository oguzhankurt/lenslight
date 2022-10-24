import express from "express"
import dotenv from "dotenv"
import conn from "./db.js"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload"
import {v2 as cloudinary} from "cloudinary"
import methodOverride  from "method-override"

import pageRoute from "./routes/pageRoute.js"
import photoRoute from "./routes/photoRoute.js"
import userRoute from "./routes/userRoute.js"
import { checkUser } from "./middlewares/authMid.js"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
})

//connection
conn()

const app = express()
const port = process.env.PORT || 3000

//ejs
app.set("view engine", "ejs")

//static files
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(fileUpload({useTempFiles: true}))
app.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}))

app.use("*", checkUser)
app.use("/", pageRoute)
app.use("/photos", photoRoute)
app.use("/user", userRoute)

app.listen(port, () => {
    console.log(`Application running on port: ${port}`)
})