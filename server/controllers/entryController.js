import entryModel from "../models/entryModel.js";

export const getEntry = async(req, res) => {
    try {
        const entryCard = await entryModel.find()
        res.status(200).json(entryCard)

    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
};

export const postEntry = async(req, res) => {
    const entry = req.body;
    const newEntry = new entryModel(entry);
    try {
        await newEntry.save()
        res.status(200).json(newEntry)

    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
}