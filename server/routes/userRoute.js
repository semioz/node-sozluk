import express from "express";
const router = express.Router();
import { signUp, logIn } from "./../controllers/authController.js";
import { getUser, createUser, deleteUser, updateUser } from "./../controllers/userController.js";


router.post("/kayit", signUp);
router.post("/giris", logIn);

router
    .route("/:nickname")
    .get(getUser)
    .delete(deleteUser)
    .patch(updateUser)

router
    .route("/")
    .post(createUser)


export default router;