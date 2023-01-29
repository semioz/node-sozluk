import AppError from "./../utils/appError.js";
import {Entry,IEntry} from "./../models/entryModel.js";
import catchAsync from "./../utils/catchAsync.js";
import { Request,Response,NextFunction } from "express";

export const getEntry = catchAsync(async(req:Request, res:Response, next:NextFunction) => {
    const entry: IEntry | null = await Entry.findById(req.params.entryNo)

    if (!entry) {
        return next(new AppError("böyle bir entry yok!",404))
    }
    res.status(200).json({
        status: "success",
        data: {
            entry
        }
    })
});

export const setEntryUserIds = (req, res: Response, next: NextFunction) => {
    if (!req.body.author) req.body.author = req.user.username;
    next()
}

export const createEntry = catchAsync(async(req:Request, res:Response, next:NextFunction) => {
    const newEntry:IEntry = await Entry.create(req.body)
    res.status(201).json({
        status: "success",
        data: {
            entry: newEntry
        }
    })
});

export const deleteEntry = catchAsync(async(req:Request, res:Response, next:NextFunction) => {
    const entry:IEntry | null = await Entry.findByIdAndDelete(req.params.entryNo)
    if (!entry) {
        return next(new AppError("böyle bir entry yok!", 404))
    }
    res.status(204).json({
        status: "success",
        data: null
    })
});

export const updateEntry = catchAsync(async(req:Request, res:Response, next:NextFunction) => {
    const entry:IEntry | null = await Entry.findByIdAndUpdate(req.params.entryNo, req.body, { new: true, runValidators: true })
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