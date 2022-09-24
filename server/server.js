import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../server/app.js";

dotenv.config();

//catch uncaught exception
process.on("uncaughtException", err => {
    console.log("UNCAUGHT EXCEPTION: Shutting down...")
    console.log(err.name, err.message)
    process.exit(1)
});

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log("MongoDB connection is successful")
}).catch(err => {
    console.log("Can't connect to the MongoDB!")
    console.log(err)
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

process.on("unhandledRejection", err => {
    console.log("UNHANDLED REJECTION: Shutting down...")
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1);
    })
});