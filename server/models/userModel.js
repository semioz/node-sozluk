import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

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
    passwordChangedAt: Date
});

//hash the password
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    //don't save the "password confirm" into database!
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined;
    next();
})

const User = mongoose.model("User", userSchema);

export default User;