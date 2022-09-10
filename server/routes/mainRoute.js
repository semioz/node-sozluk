import express from "express";
const router = express.Router();
import entryController from "../controllers/entryController.js";

router
    .route("/")
    .get(entryController.getEntry)
    .post(entryController.postEntry)

export default router;