import User from "../models/userModel.js";
import AppError from "../utils/appError.js";


export const getUser = async(req, res, next) => {
    const user = await User.findOne({ username: req.params.nickname })

    if (!user) {
        return next(new AppError("böyle bir kullanıcı yok!"))
    }
    res.status(200).json({
        status: "success",
        data: {
            user
        }
    })
};

export const createUser = async(req, res, next) => {
    const newUser = await User.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            user: newUser
        }
    })
};

export const deleteUser = async(req, res, next) => {
    const user = await User.findOneAndDelete({ username: req.params.nickname })
    if (!user) {
        return next(new AppError("bu nick'e sahip bir kullanıcı yok!", 404))
    }
    res.status(204).json({
        status: "success",
        data: null
    })
};

//kullanıcı nickname değiştiremez, sadece biyografi ve profil fotoğrafı değiştirebilir
export const updateUser = async(req, res, next) => {
    const updatedUser = await User.findOneAndUpdate({ username: req.params.nickname })
    if (!user) {
        return next(new AppError("bu nick'e sahip bir kullanıcı yok!", 404))
    }
    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser
        }
    })
};