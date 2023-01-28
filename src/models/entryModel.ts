import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
    author: { type: String, required: true },
    baslik: { type: String, required: true },
    entry: { type: String, max: 102399, required: true },
    nodeLike: { type: Array, default: [] },
    nodeUp: { type: Array, default: [] },
    nodeDown: { type: Array, default: [] },
    createdAt: { type: Date, default: new Date().toISOString() }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Entry = mongoose.model("Entry", entrySchema);

export default Entry;