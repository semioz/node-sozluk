import express from "express";
const router = express.Router();
import { signUp, logIn, protect, restricTo } from "./../controllers/authController.js";
import { getUser, createUser, deleteUser, updateUser } from "./../controllers/userController.js";


router.post("/kayit", signUp);
router.post("/giris", logIn);

router
    .route("/:nickname")
    .get(getUser)
    //???
    .delete(protect, restricTo("moderatör"), deleteUser)
    .patch(updateUser)

router
    .route("/")
    .post(createUser)


export default router;