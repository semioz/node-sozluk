import express from "express";
const router = express.Router();
import { signUp, logIn, protect, updatePassword, forgotPassword, resetPassword } from "./../controllers/authController.js";
import { getUser, deleteMe, updateMe } from "./../controllers/userController.js";


router.post("/kayit", signUp);
router.post("/giris", logIn);

router.patch("/ayarlar/sifre", protect, updatePassword);
router.patch("/ayarlar/hesabi-kapat", protect, deleteMe)
router.patch("/ayarlar/guncelle", protect, updateMe)

router.post("/ayarlar/sifremi-unuttum", protect, forgotPassword)
router.post("/ayarlar/sifremi-resetle", protect, resetPassword)


router
    .route("/:nickname")
    .get(getUser)
    //.patch(updateMe) ???


export default router;