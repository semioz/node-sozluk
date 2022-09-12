import express  from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import userRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log("MongoDB connection is successful")
}).catch(err => {
    console.log("Can't connect to the MongoDB!")
    console.log(err)
});
//middlewares
app.use(express.json())
app.use(morgan("common"));
app.use(helmet());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));


app.use("/api/biri", userRouter);
app.use("/api/auth", authRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});