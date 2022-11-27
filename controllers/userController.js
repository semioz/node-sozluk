import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "./../utils/catchAsync.js";

const filteredObj = (obj, ...allowedFiels) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFiels.includes(el)) newObj[el] = obj[el]
    })
    return newObj
};

export const getUser = catchAsync(async(req, res, next) => {
    const user = await User.findOne({ username: req.params.nickname })
        //.cache({ key: req.params.nickname })

    if (!user) {
        return next(new AppError("böyle bir kullanıcı yok!"))
    }

    res.status(200).json({
        status: "success",
        data: {
            user
        }
    })
});

export const deleteMe = catchAsync(async(req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, { active: false })
    res.status(204).json({
        status: "success",
        data: null
    })
});

//kullanıcı nickname değiştiremez, sadece biyografi ve profil fotoğrafı değiştirebilir
export const updateMe = catchAsync(async(req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError("This route is not for password updates. Use /update-my-password instead.", 400))
    }
    //kullanıcının değiştirmesini istemeyeceğimiz şeyleri filtreliyoruz.
    const filteredBody = filteredObj(req.body, "email", "about", "profilePicture");
    //kullanıcıy güncelle
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status: "success",
        data: {
            updatedUser
        }
    })
});

export const deleteUser = catchAsync(async(req, res, next) => {
    const user = await User.findOneAndDelete({ username: req.params.nickname });
    if (!user) {
        return next(new AppError("böyle bir kullanıcı yok!", 404));
    }
    res.status(204).json({
        status: "success",
        data: null
    })
});

export const updateUser = catchAsync(async(req, res, next) => {
    const user = await User.findOneAndUpdate({ username: req.params.nickname }, req.body, { new: true, runValidators: true });
    if (!user) {
        return next(new AppError("böyle bir kullanıcı yok", 404));
    }
    res.status(204).json({
        status: "success",
        data: user
    })
});