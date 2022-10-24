import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Photo from "../models/photosModel.js"

const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.redirect("/login")
    } catch (err) {
        res.status(500).json({
            success: false,
            err: err.message
        })
    }

}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        let same = false
        if (user) {
            same = await bcrypt.compare(password, user.password)
        } else {
            return res.status(401).json({
                success: false,
                err: "Kullanıcı bulunamadı."
            })

        }
        if (same) {
            const token = createToken(user.id)
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24
            })
            res.redirect("/user/dashboard")
        }
        else {
            res.send("olmadı şifre")
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            err: err.message
        })
    }

}

const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })
}

const getDashboard = async (req, res) => {
    const photos = await Photo.find({ user: res.locals.user.id })
    const user = await User.findById({ _id: res.locals.user.id }).populate(["followings", "followers"])
    res.render("dashboard", { link: "dashboard", photos, user })
}

const getAllUser = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: res.locals.user.id } })
        res.status(200).render("users", { users, link: "users" })
    } catch (err) {
        res.status(500).json({
            success: false,
            err: err.message
        })
    }
}

const getAUser = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id })
        const inFollowers = user.followers.some((follower) => {
            return follower.equals(res.locals.user.id)
        })
        const photos = await Photo.find({ user: user.id })
        res.status(200).render("user", { user, photos, inFollowers, link: "users" })
    } catch (err) {
        res.status(500).json({
            success: false,
            err: err.message
        })
    }
}

const follow = async (req, res) => {
    try {
        let user
        user = await User.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $push: {
                    followers: res.locals.user.id
                }
            },
            { new: true }
        )
        user = await User.findByIdAndUpdate(
            { _id: res.locals.user.id },
            {
                $push: {
                    followings: req.params.id
                }
            },
            { new: true }
        )
        res.status(200).redirect(`/user/${req.params.id}`)
    } catch (err) {
        res.status(500).json({
            success: false,
            err: err.message
        })
    }
}

const unFollow = async (req, res) => {
    try {
        let user
        user = await User.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $pull: {
                    followers: res.locals.user.id
                }
            },
            { new: true }
        )
        user = await User.findByIdAndUpdate(
            { _id: res.locals.user.id },
            {
                $pull: {
                    followings: req.params.id
                }
            },
            { new: true }
        )
        res.status(200).redirect(`/user/${req.params.id}`)
    } catch (err) {
        res.status(500).json({
            success: false,
            err: err.message
        })
    }
}

export {
    createUser,
    loginUser,
    getDashboard,
    getAllUser,
    getAUser,
    follow,
    unFollow
}