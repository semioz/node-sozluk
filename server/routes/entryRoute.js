import express from "express";
const router = express.Router();
import { protect, restricTo } from "./../controllers/authController.js";
import { getEntry, createEntry, deleteEntry, updateEntry } from "./../controllers/entryController.js";

//kullanıcı, giris yapmadan entry yazamaz, degistiremez, silemez!

router
    .route("/:entrynum")
    .get(getEntry)
    .patch(updateEntry)
    //???
    .delete(deleteEntry)

router
    .route("/")
    .post(createEntry)


export default router;