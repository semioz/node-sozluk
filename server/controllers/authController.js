import jwt from "jsonwebtoken";
import User from "./../models/userModel.js";
import AppError from "./../utils/appError.js";

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

export const signUp = async(req, res, next) => {
    const newUser = await User.create({
        username: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
    });
    const token = signToken(newUser._id)

    res.status(201).json({
        status: "success",
        token,
        data:  {
            user: newUser
        }
    })
};