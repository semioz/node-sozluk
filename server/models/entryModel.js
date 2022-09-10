import mongoose from "mongoose";

const entrySchema = mongoose.Schema({
    description: String,
    author: String,
    nodeUp: { type: Number, default: 0 },
    nodeDown: { type: Number, default: 0 },
    createdAt: { type: Date, default: new Date() }
});

const entryModel = mongoose.model("entryModel", entrySchema);

export default entryModel;