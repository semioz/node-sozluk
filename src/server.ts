import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js"
import "./services/cache";

dotenv.config();

//catch uncaught exception
process.on("uncaughtException", (err:Error) => {
    console.log("UNCAUGHT EXCEPTION: Shutting down...")
    console.log(err.name, err.message)
    process.exit(1)
});

let uri;
if (process.env["NODE_ENV"] == "test") {
    uri = process.env.TEST_URI;
} else {
    uri = process.env.MONGO_URI;
};

mongoose.connect(uri).then(() => {
    console.log("MongoDB connection is successful")
}).catch((err:Error) => {
    console.log("Can't connect to the MongoDB!")
    console.log(err)
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

process.on("unhandledRejection", (err:Error) => {
    console.log("UNHANDLED REJECTION: Shutting down...")
    if(err instanceof Error)console.log(err.name,err.message);
    server.close(() => {
        process.exit(1);
    })
});

export default server;