import mongoose from "mongoose";

export interface IEntry{
    author:string,
    baslik:string,
    entry:string,
    nodeUp:mongoose.Schema.Types.Array,
    nodeDown:mongoose.Schema.Types.Array,
    createdAt:string
}

const entrySchema = new mongoose.Schema<IEntry>({
    author: { type: String, required: true },
    baslik: { type: String, required: true },
    entry: { type: String, max: 102399, required: true },
    nodeUp: { type: Array, default: [] },
    nodeDown: { type: Array, default: [] },
    createdAt: { type: String, default: new Date().toISOString() }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export const Entry = mongoose.model("Entry", entrySchema);