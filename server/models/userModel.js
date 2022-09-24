import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "bir nick seçmelisin!"],
        unique: [true, "bu nick alınmış!"],
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "email lazım"],
        lowercase: true,
        validate: [validator.isEmail, "geçerli bir email değil bu!"],
        unique: [true, "bu email önceden kullanılmış!"]
    },
    role: {
        type: String,
        enum: ["çaylak", "yazar", "moderatör"],
        default: "çaylak"
    },
    password: {
        type: String,
        required: [true, "bir şifre belirlemelisin!"],
        minLength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "şifreni tekrar girmelisin!"],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: "şifreler uyuşmuyor!"
        }
    },
    following: {
        type: Array,
        default: []
    },
    followers: {
        type: Array,
        default: []
    },
    about: {
        type: String,
        max: 60,
        trim: true
    },
    createdAt: {
        type: Date,
        default: new Date().toISOString()
    },
    updatedAt: { type: Date },
    profilePicture: {
        type: String,
        default: ""
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

//hash the password
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    //don't save the "password confirm" into database!
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined;
    next();
})

userSchema.pre("save", function(next) {
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

//we don't users to see unactive property
userSchema.pre(/^find/, function(next) {
    //this points to current query
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimeStamp
    }
    //false means "not changed"
    return false;
}

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return bcrypt.compare(candidatePassword, userPassword)
};

//bu token yalnızca 10 dakikalığına geçerli olacağı için bcrypt hashlemeye gerek yok!
userSchema.methods.createPasswordResetToken = async function() {
    //gecici sifre olustur crypto modülü ile
    //72 karakter uzunlugunda güclü bir sifre olustur
    const resetToken = crypto.randomBytes(32).toString("hex")

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

const User = mongoose.model("User", userSchema);

export default User;