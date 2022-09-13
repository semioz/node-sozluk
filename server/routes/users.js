import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import User from "../models/userModel.js";

router
    .patch("/:id", async(req, res) => {
        if (req.body.userID === req.params.id ||  req.body.isAdmin) {
            if (req.body.password) {
                try  {
                    const salt = await bcrypt.genSalt(10)
                    req.body.password = await bcrypt.hash(req.body.password, salt)
                } catch (err) {
                    return res.status(500).json(err)
                }
            }
            try {
                const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
                res.status(200).json("hesap başarıyla güncellendi!")
            } catch (err) {
                res.status(500).json(err)
            }
        } else {
            return res.status(403).json("You can only update your account!")
        }
    })

router
    .delete("/:id", async(req, res) => {
        if (req.body.userID === req.params.id ||  req.body.isAdmin) {
            try {
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("hesap başarıyla silindi!")
            } catch (err) {
                res.status(500).json(err)
            }
        } else {
            return res.status(403).json("You can only delete your account!")
        }
    })

router
    .get("/:id", async(req, res) => {
        try {
            const user = await User.findById(req.params.id)
            const { password, updatedAt, ...other } = user._doc;
            res.status(200).json(other)
        } catch (err) {
            res.status(500).json("yok böyle bir kullanıcı!")
        }
    })

router.put("/:id/takip", async(req, res) => {
    if (req.body.userID !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userID);
            if (!user.followers.includes(req.body.userID)) {
                await user.updateOne({ $push: { followers: req.body.userID } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("kullanıcı takip edildi!");
            } else {
                res.status(403).json("bu kişiyi zaten takip ediyorsun!");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("kendini takip edemezsin ki!");
    }
});

router.put("/:id/takipsiz", async(req, res) => {
    if (req.body.userID !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userID);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userID } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json("kullanıcı takipten çıkarıldı!");
            } else {
                res.status(403).json("bu kullanıcıyı takip etmiyorsun!");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("kendini takipten çıkamazsın ki!");
    }
});

export default router;