import express from "express";
const router = express.Router();
import { getEntry, createEntry, deleteEntry, updateEntry } from "./../controllers/entryController.js";


router
    .route("/:entrynum")
    .get(getEntry)
    .patch(updateEntry)
    .delete(deleteEntry)

router
    .route("/")
    .post(createEntry)


export default router;