import jwt from "jsonwebtoken";
import User from "./../models/userModel.js";
import AppError from "./../utils/appError.js";
import catchAsync from "./../utils/catchAsync.js";
import { promisify } from "util";

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

export const signUp = catchAsync(async(req, res, next) => {
    const newUser = await User.create({
        username: req.body.username,
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
});

export const logIn = catchAsync(async(req, res, next) => {
    const { email, password } = req.body;

    //kullanıcının email ve şifreyi yazıp yazmadığını kontrol et
    if (!email || !password) {
        return next(new AppError("email ve şifre gerekli!"))
    }

    //kullanıcını varolup olmadığını ve şifrenin doğruluğunu kontrol et!
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("hatalı email veya şifre!", 401))
    }
    //sıkıntı yoksa tokeni client'a yolla
    const token = signToken(user._id)
    res.status(200).json({
        status: "success",
        token
    })
});

//kullanıcının kimliğinin doğrulup doğrulanmadığını kontrol et.

export const protect = catchAsync(async(req, res, next) => {
    let token;
    if (req.headers.authorization || req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
        return next(new AppError("giriş yapmadın!"))
    }

    //jwt'i doğrula
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    //jwt'nin sahibinin hala mevcut olup olmadığını kontrol et
    const freshUser = await User.findById(decoded.id)
    if (!freshUser) {
        return next(new AppError("bu tokenin sahibi yok!"))
    }


    req.user = freshUser;
    next();
});