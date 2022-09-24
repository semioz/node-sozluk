import express  from "express";
import morgan from "morgan";
import userRoute from "./routes/userRoute.js";
import entryRoute from "./routes/entryRoute.js"
import AppError from "./utils/appError.js"
import globalErrorHandler from "./controllers/errorController.js";

const app = express();

//middlewares
app.use(express.json())
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
};

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});


app.use("/biri", userRoute);
app.use("/entry", entryRoute);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler)

export default app;