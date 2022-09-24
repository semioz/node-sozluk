import jwt from "jsonwebtoken";
import User from "./../models/userModel.js";
import AppError from "./../utils/appError.js";
import catchAsync from "./../utils/catchAsync.js";
import { promisify } from "util";
import sendMail from "./../utils/email.js";

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)

    //jwt'i cookie olarak yolla
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === "production") cookieOptions.secure = true
    res.cookie("jwt", token, cookieOptions);
    //remove password from output
    user.password = undefined;

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
    //bu şekilde direkt istenilen değişkenleri bodyden cekebiliyosun
    const { email, password } = req.body;

    //kullanıcının email ve şifreyi yazıp yazmadığını kontrol et
    if (!email || !password) {
        return next(new AppError("email ve şifre gerekli!", 400))
    }

    //kullanıcını varolup olmadığını ve şifrenin doğruluğunu kontrol et!
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("hatalı email veya şifre!", 401))
    }
    //sıkıntı yoksa tokeni client'a yolla
    createSendToken(user, 200, res)
});

//kullanıcının kimliğinin doğrulup doğrulanmadığını kontrol et bu middleware ile!

export const protect = catchAsync(async(req, res, next) => {
    let token;
    //Bearer <token>
    //buradaki tokeni almak istiyoruz
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }
    if (!token) {
        return next(new AppError("giriş yapmadın!", 401))
    }

    //tokeni doğrula
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
//kullanıcıya göre izin vermek...
export const restricTo = (...roller) => {
    return (req, res, next) => {
        //roller -> ["çaylak", "yazar", "moderatör"]
        if (!roller.includes(req.user.role)) {
            //app error'un içini düzenle sonra!!!
            return next(new AppError("bunu yapamazsın!", 403))
        }
    }
};

export const forgotPassword = catchAsync(async(req, res, next) => {
    //emaile göre kullanıcıyı bul
    const user = User.findOne({ email: req.body.email })
    if (!user) {
        return next(new AppError("bu emaile sahip bir kullanıcı yok!", 404))
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    //kullanıcının emailine yolla
    const resetURL = `${req.protocol}://${req.get("host")}/ayarlar/sifre-sifirla/${resetToken}`

    //burasi degisecek tabii ki :D
    const message = `şu '${resetURL}' url'e şifre ve şifre onay seçenekleriyle patch request at!`

    try {
        await sendMail({
            email: user.email,
            subject: "şifre sıfırlama tokeni (yalnızca 10 dakika geçerli!)",
            message
        })
        res.status(200).json({
            status: "success",
            message: "token emaile yollandı!"
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false })

        return next(new AppError("emaili yollarken birtakım hatalar çıktı!", 500))
    }
});

export const resetPassword = catchAsync(async(req, res, next) => {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    })
    if (!user) {
        return next(new AppError("Token is invalid or has expired", 400))
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save()

    createAndSendToken(user, 200, res)
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