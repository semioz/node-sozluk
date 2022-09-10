import express  from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import mainRoute from "./routes/mainRoute.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use("/popular", mainRoute);

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors);

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log("MongoDB connection is successful")
}).catch(err => {
    console.log("Can't connect to the MongoDB!")
    console.log(err)
});



app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});