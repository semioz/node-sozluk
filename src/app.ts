import express,{Request,Response,NextFunction}  from "express";
import morgan from "morgan";
import userRoute from "./routes/userRoute.js";
import entryRoute from "./routes/entryRoute.js"
import AppError from "./utils/appError.js"
import globalErrorHandler from "./controllers/errorController.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
const app = express();

//--Middlewares--

//security http headers
app.use(helmet());

//development logging
app.use(express.json())
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
};

//aynı IP'den gelen requestlere sınır koy
const limiter = rateLimit({
    //1 saatte maksimum 100 istek atabilir aynı IP
    max: 100,
    windowMs: 60 * 60 * 100,
    message: "Too many requests from this IP. Please try again later!"
})

app.use("/api", limiter)

//body parser
app.use(express.json({
    limit: "10kb"
}));
//security against nosql query injection
app.use(mongoSanitize());

//Data sanitization against XSS attacks
app.use(xss());

app.use((req:Request, res:Response, next:NextFunction) => {
    req.requestTime = new Date().toISOString();
    next();
});

//prevent parameter pollution
app.use(hpp({
    whitelist: [
        "duration",
        "ratingsQuantity",
        "ratingsAverage",
        "difficulty",
        "maxGroupSize",
        "price"
    ]
}));

//----Routes----
app.use("/api/v1/biri", userRoute);
app.use("/api/v1/entry", entryRoute);

app.all("*", (req:Request, res:Response, next:NextFunction  ) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;