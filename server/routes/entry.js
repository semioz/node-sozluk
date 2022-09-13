import express from "express";
const router = express.Router();
import Entry from "../models/entryModel.js";

//create a entry

router.post("/", async(req, res) => {
    const newEntry = new Entry(req.body);
    try {
        const savedEntry = await newEntry.save();
        res.status(200).json(savedEntry);
    } catch (err) {
        res.status(500).json(err);
    }
});
//update a entry

router.patch("/:id", async(req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);
        if (entry.userID === req.body.userID) {
            await entry.updateOne({ $set: req.body });
            res.status(200).json("the post has been updated");
        } else {
            res.status(403).json("you can update only your post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
//delete a entry

router.delete("/:id", async(req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);
        if (entry.userID === req.body.userID) {
            await entry.deleteOne();
            res.status(200).json("entry silindi!");
        } else {
            res.status(403).json("sadece kendi entry'ni silebilirsin!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
//like an entry

router.put("/:id/like", async(req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);
        if (!entry.nodeLike.includes(req.body.userID)) {
            await entry.updateOne({ $push: { nodeLike: req.body.userID } });
            res.status(200).json("entry beğenildi!");
        } else {
            await entry.updateOne({ $pull: { nodeLike: req.body.userID } });
            res.status(200).json("The post has been disliked");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
//get an entry

router.get("/:id", async(req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);
        res.status(200).json(entry);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get timeline entries

router.get("/timeline/all", async(req, res) => {
    try {
        const currentUser = await User.findById(req.body.userID);
        const userEntries = await Entry.find({ userID: currentUser._id });
        const friendEntries = await Promise.all(
            currentUser.following.map((friendId) => {
                return Entry.find({ userID: friendId });
            })
        );
        res.json(userEntries.concat(...friendEntries))
    } catch (err) {
        res.status(500).json(err);
    }
});


export default router;