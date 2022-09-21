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

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)

    res.status(statusCode).json({
        status: "success",
        token,
        data:  {
            user
        }
    })
};

export const signUp = catchAsync(async(req, res, next) => {
    const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
    });
    createSendToken(newUser, 201, res)
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
    createSendToken(user, 200, res)
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
    //jwt kendisine tanımlandıktan sonra, kullanıcının şifresini değiştirip değiştirmediğini kontrol et!
    if (freshUser.changedPasswordAfter(decoded.iat)) { //iat = issued at
        return next(new AppError("şifreni değiştirdin! lütfen giriş yap!", 401))
    }

    req.user = freshUser;
    next();
});

export const restricTo = (...roller) => {
    return (req, res, next) => {
        //roller -> çaylak, yazar, moderatör
        if (!roller.includes(req.user.role)) {
            //app error'un içini düzenle sonra!!!
            return next(new AppError("bunu yapamazsın!"))
        }
    }
};

export const forgotPassword = catchAsync(async(req, res, next) => {

});

export const resetPassword = catchAsync(async(req, res, next) => {

});

export const updatePassword = catchAsync(async(req, res, next) => {
    //db'den kullanıcıyı getir
    const user = await User.findById(req.user.id).select("+password");

    //kullanıcıdan şifresini değiştirmesi için ilk önce güncel şifresini iste
    //şifrenin doğruluğunun kontrolü
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError("girdiğin şifre doğru değil!", 401))
    };
    //eğer doğruysa, şifresini güncelle.
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm
        //log the user in, send JWT
    createSendToken(user, 200, res);

});