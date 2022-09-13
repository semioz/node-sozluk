import mongoose from "mongoose";

const entrySchema = mongoose.Schema({
    userID: { type: String, required: true },
    baslik: { type: String, required: true },
    entry: { type: String, max: 500 },
    nodeLike: { type: Array, default: [] },
    nodeUp: { type: Array, default: [] },
    nodeDown: { type: Array, default: [] },
    createdAt: { type: Date, default: new Date() }
});

const entryModel = mongoose.model("entryModel", entrySchema);

export default entryModel;