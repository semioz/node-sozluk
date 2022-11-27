import AppError from "./../utils/appError.js";
import Entry from "../models/entryModel.js";
import catchAsync from "./../utils/catchAsync.js";

export const getEntry = catchAsync(async(req, res, next) => {
    const entry = await Entry.findById(req.params.entryNo)

    if (!entry) {
        return next(new AppError("böyle bir entry yok!"))
    }
    res.status(200).json({
        status: "success",
        data: {
            entry
        }
    })
});

export const setEntryUserIds = (req, res, next) => {
    if (!req.body.author) req.body.author = req.user.username;
    next()
}

export const createEntry = catchAsync(async(req, res, next) => {
    const newEntry = await Entry.create(req.body)
    res.status(201).json({
        status: "success",
        data: {
            entry: newEntry
        }
    })
});

export const deleteEntry = catchAsync(async(req, res, next) => {
    const entry = await Entry.findByIdAndDelete(req.params.entryNo)
    if (!entry) {
        return next(new AppError("böyle bir entry yok!", 404))
    }
    res.status(204).json({
        status: "success",
        data: null
    })
});

export const updateEntry = catchAsync(async(req, res, next) => {
    const entry = await Entry.findByIdAndUpdate(req.params.entryNo, req.body, { new: true, runValidators: true })
    if (!entry) {
        return next(new AppError("böyle bir entry yok!", 404))
    }
    res.status(200).json({
        status: "success",
        data: {
            entry
        }
    })
});