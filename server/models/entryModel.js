import mongoose from "mongoose";

const entrySchema = mongoose.Schema({
    author: { type: String, required: true },
    entryNumber: { type: Number, default: Date.now() },
    baslik: { type: String, required: true },
    entry: { type: String, max: 102399, required: true },
    nodeLike: { type: Array, default: [] },
    nodeUp: { type: Array, default: [] },
    nodeDown: { type: Array, default: [] },
    createdAt: { type: Date, default: new Date().toISOString() }
    //entry düzenleme tarihini ekle
});

const Entry = mongoose.model("Entry", entrySchema);

export default Entry;