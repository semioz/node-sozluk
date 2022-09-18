import AppError from "./../utils/appError.js";
import Entry from "../models/entryModel.js";

export const getEntry = async(req, res, next) => {
    const entry = await Entry.findOne({ entryNumber: req.params.entrynum })

    if (!entry) {
        return next(new AppError("böyle bir entry yok!"))
    }
    res.status(200).json({
        status: "success",
        data: {
            entry
        }
    })
};

export const createEntry = async(req, res, next) => {
    const newEntry = await Entry.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            entry: newEntry
        }
    })
};

export const deleteEntry = async(req, res, next) => {
    const entry = await Entry.findOneAndDelete({ entryNumber: req.params.entrynum })
    if (!entry) {
        return next(new AppError("böyle bir entry yok!", 404))
    }
    res.status(204).json({
        status: "success",
        data: null
    })
};

//entry'yi sadece o entry'yi yazan değiştirebilir, moderatör sadece silebilir. değiştiremez.
export const updateEntry = async(req, res, next) => {
    const updatedEntry = await Entry.findOneAndUpdate({ entryNumber: req.params.entrynum })
        //catchAsync lazım gibi buraya. bi bak
    if (!entry) {
        return next(new AppError("böyle bir entry yok!", 404))
    }
    res.status(200).json({
        status: "success",
        data: {
            entry: updatedEntry
        }
    })
};