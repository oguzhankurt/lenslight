import Photo from "../models/photosModel.js"
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

const createPhoto = async (req, res) => {
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        use_filename: true,
        folder: "lenslight"
    })

    try {
        await Photo.create({
            name: req.body.name,
            description: req.body.description,
            user: res.locals.user.id,
            url: result.secure_url,
            image_id: result.public_id
        })
        fs.unlinkSync(req.files.image.tempFilePath)
        res.status(201).redirect("/user/dashboard")
    } catch (err) {
        res.status(500).json({
            success: false,
            err: err.message
        })
    }

}

const getAllPhotos = async (req, res) => {
    try {
        const photos = res.locals.user ? await Photo.find({ user: { $ne: res.locals.user.id } })
            :
            await Photo.find({})
        res.status(200).render("photos", { photos, link: "photos" })


    } catch (err) {
        res.status(500).json({
            success: false,
            err: err.message
        })
    }
}

const getAPhoto = async (req, res) => {
    try {
        const photo = await Photo.findById({ _id: req.params.id }).populate("user")
        res.status(200).render("photo", { photo, link: "photos" })
    } catch (err) {
        res.status(500).json({
            success: false,
            err: err.message
        })
    }
}

const deletePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id)
        const photo_id = photo.image_id

        await cloudinary.uploader.destroy(photo_id)
        await Photo.findByIdAndRemove(req.params.id)

        res.status(200).redirect("/user/dashboard")
    } catch (err) {
        res.status(500).json({
            success: false,
            err: err.message
        })
    }
}

const updatePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id)
        if (req.files) {
            const photo_id = photo.image_id
            await cloudinary.uploader.destroy(photo_id)
            const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
                use_filename: true,
                folder: "lenslight"
            })
            photo.url = result.secure_url
            photo.image_id = result.public_id
            fs.unlinkSync(req.files.image.tempFilePath)
        }
        photo.name = req.body.name
        photo.description = req.body.description
        photo.save()

        res.status(200).redirect(`/photos/${req.params.id}`)
    } catch (err) {
        res.status(500).json({
            success: false,
            err: err.message
        })
    }
}

export {
    createPhoto,
    getAllPhotos,
    getAPhoto,
    deletePhoto,
    updatePhoto
}