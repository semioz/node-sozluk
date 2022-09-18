import express from "express";
const router = express.Router();
import { getUser, createUser, deleteUser, updateUser } from "./../controllers/userController.js";


//router.post("/kayit", authController.signup);
//router.post("/giris", authController.login);

router
    .route("/:nickname")
    .get(getUser)
    .delete(deleteUser)
    .patch(updateUser)

router
    .route("/")
    .post(createUser)


export default router;