import express from "express";
const router = express.Router();
import { protect, restricTo } from "./../controllers/authController.js";
import { getEntry, createEntry, deleteEntry, updateEntry, getDebe, setEntryUserIds } from "./../controllers/entryController.js";

//kullanıcı, giris yapmadan entry yazamaz, degistiremez, silemez!

router
    .route("/:entrynum")
    .get(getDebe)
    .get(getEntry)
    .patch(protect, updateEntry)
    //???
    .delete(protect, deleteEntry)

router
    .route("/")
    .post(protect, setEntryUserIds, createEntry)


export default router;