import express from "express"
import { createPhoto, deletePhoto, getAllPhotos, getAPhoto, updatePhoto } from "../controllers/photoController.js"
const router = express.Router()

router.post("/", createPhoto)
router.get("/", getAllPhotos)
router.get("/:id", getAPhoto)
router.delete("/:id", deletePhoto)
router.put("/:id", updatePhoto)

export default router