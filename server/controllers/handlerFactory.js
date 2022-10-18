import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const deleteOne = (Model, name) => catchAsync(async(req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc) {
        return next(new AppError(`böyle bir ${name} bulunamadı!`))
    }
    res.status(204).json({
        status: "success",
        data: null
    })
});