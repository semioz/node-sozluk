import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    entryNumber: { type: Number },
    following: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    about: { type: String, max: 50 },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date },
    profilePicture: { type: String, default: "" }
});

const userModel = mongoose.model("userModel", userSchema);

export default userModel;