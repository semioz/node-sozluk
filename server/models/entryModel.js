import mongoose from "mongoose";

const entrySchema = mongoose.Schema({
    entry: String,
    author: String,
    nodeLike: { type: Number, default: null },
    nodeUp: { type: Number, default: 0 },
    nodeDown: { type: Number, default: 0 },
    createdAt: { type: Date, default: new Date() }
});

const entryModel = mongoose.model("entryModel", entrySchema);

export default entryModel;