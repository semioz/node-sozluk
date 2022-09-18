import express from "express";
const router = express.Router();
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

//register
router.post("/kayit", async(req, res) => {
    try {
        //encrypt the user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            password: hashedPassword
        })
        const user = await newUser.save();
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
})

//login
router.post("/giris", async(req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(404).json("yok böyle bir kullanıcı!")

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        !validPassword && res.status(400).json("şifre hatalı olabilir mi acaba?")

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
});

export default router;