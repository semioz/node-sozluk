import express from "express";
const router = express.Router();
import { protect, restricTo } from "./../controllers/authController.js";
import { getEntry, createEntry, deleteEntry, updateEntry, setEntryUserIds } from "./../controllers/entryController.js";

router
    .route("/:entryNo")
    .get(getEntry)
    .patch(protect, updateEntry)
    .delete(protect, deleteEntry)

router
    .route("/")
    .post(protect, setEntryUserIds, createEntry)

export default router;