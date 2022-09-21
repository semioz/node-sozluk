import express from "express";
const router = express.Router();
import { signUp, logIn, protect, restricTo, updatePassword } from "./../controllers/authController.js";
import { getUser, deleteUser, updateUser } from "./../controllers/userController.js";


router.post("/kayit", signUp);
router.post("/giris", logIn);

router.patch("/ayarlar/sifre", protect, updatePassword);

router
    .route("/:nickname")
    .get(getUser)
    //???
    .delete(protect, restricTo("moderatör"), deleteUser)
    .patch(updateUser)


export default router;